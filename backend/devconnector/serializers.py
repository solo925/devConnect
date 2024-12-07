from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import (
    User,
    Profile,
    Experience,
    Education,
    Post,
    Comment
)
from .utils import get_gravatar
from rest_framework_simplejwt.tokens import RefreshToken

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'avatar', 'date', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, validated_data):
        # Create the user
        user = User.objects.create_user(**validated_data)
        user.avatar = get_gravatar(validated_data.get('email'))
        user.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'avatar': user.avatar,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }



class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'

class GetProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    experience = ExperienceSerializer(many=True)
    education = EducationSerializer(many=True)

    class Meta:
        model = Profile
        fields = [
            'id','user','company','website','location',
            'status', 'skills', 'bio', 'githubusername',
            'youtube', 'twitter', 'facebook', 'linkedin',
            'instagram', 'experience', 'education'
        ]

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id','user','text','name','avatar','date','likes','post_comments']
        read_only_fields = ('post_comments',)

class CommentSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name',read_only=True)
    avatar = serializers.URLField(source='user.avatar',read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id','user','post','text','date','name','avatar']
        
class GetPostSerializer(serializers.ModelSerializer):
    post_comments = CommentSerializer(many=True)
    class Meta:
        model = Post
        fields = ['id','user','text','name','avatar','date','likes','post_comments']