from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse

from .serializers import (
    UserSerializer,
    ProfileSerializer,
    GetProfileSerializer,
    ExperienceSerializer,
    EducationSerializer,
    PostSerializer,
    GetPostSerializer,
    CommentSerializer
)
from .models import User, Profile, Experience, Education, Post, Comment



def generate_tokens(user):
    """
    Generate JWT access and refresh tokens for a user.
    """
    if not isinstance(user, User):  # Ensure user is a valid User model instance
        raise ValueError("Expected a User instance for token generation")

    # Create tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    # Log token creation (for debugging)
    print(f"Generated tokens for user {user.email}: Access - {access_token}, Refresh - {refresh_token}")

    return {
        "access": access_token,
        "refresh": refresh_token
    }



class LoginUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Please provide both email and password"}, status=400)

        user = authenticate(username=email, password=password)
        if not user:
            return Response({"error": "Invalid credentials"}, status=401)

        try:
            tokens = generate_tokens(user)

            # Return user data along with the tokens
            return Response({
                "user": UserSerializer(user).data,
                "access": tokens["access"],  # Ensure access token is sent
                "refresh": tokens["refresh"],  # Ensure refresh token is sent
            })
        except Exception as e:
            return Response({"error": f"Token generation failed: {str(e)}"}, status=500)

class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Save the user and get the instance
                user = serializer.save()
                
                # Generate tokens for the user
                tokens = generate_tokens(user)
                
                # Return user details and tokens
                return Response({
                    'user': UserSerializer(user).data,
                    'refresh': tokens['refresh'],
                    'access': tokens['access']
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                # Log the error for debugging
                print(f"Error during token generation: {e}")
                return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Profiles
class ProfilesView(APIView):
    def get(self, request):
        profiles = Profile.objects.all()
        return Response(GetProfileSerializer(profiles, many=True).data)


class ProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = get_object_or_404(Profile, user=request.user)
            return Response(GetProfileSerializer(profile).data)
        except Exception as e:
            return Response({"error": "Profile not found", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            # Check if the user already has a profile
            profile, created = Profile.objects.get_or_create(user=request.user)
            serializer = ProfileSerializer(instance=profile, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response(GetProfileSerializer(profile).data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            # Delete the profile and the user
            request.user.delete()
            return Response({"message": "User and profile deleted"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PostView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id=None):
        if post_id:
            post = get_object_or_404(Post, id=post_id)
            return Response(GetPostSerializer(post).data)
        posts = Post.objects.all()
        return Response(PostSerializer(posts, many=True).data)

    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, post_id):
        post = get_object_or_404(Post, id=post_id, user=request.user)
        post.delete()
        return Response({"message": "Post deleted"}, status=status.HTTP_204_NO_CONTENT)


# Comments
class CommentView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, comment_id):
        comment = get_object_or_404(Comment, id=comment_id, user=request.user)
        comment.delete()
        return Response({"message": "Comment deleted"}, status=status.HTTP_204_NO_CONTENT)


# Add Experience
class ExperienceView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ExperienceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(profile=request.user.profile)
            return Response(GetProfileSerializer(request.user.profile).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, exp_id):
        experience = get_object_or_404(Experience, id=exp_id, profile=request.user.profile)
        experience.delete()
        return Response(GetProfileSerializer(request.user.profile).data)


# Add Education
class EducationView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EducationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(profile=request.user.profile)
            return Response(GetProfileSerializer(request.user.profile).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, edu_id):
        education = get_object_or_404(Education, id=edu_id, profile=request.user.profile)
        education.delete()
        return Response(GetProfileSerializer(request.user.profile).data)
