from django.urls import path
from .views import (
    RegisterUserView,
    LoginUserView,
    ProfilesView,
    ProfileView,
    PostView,
    CommentView,
    ExperienceView,
    EducationView
)

urlpatterns = [
    # Authentication
    path("auth/register", RegisterUserView.as_view(), name="register"),
    path("auth/login", LoginUserView.as_view(), name="login"),
    # path("auth/user", AuthenticatedUserView.as_view(), name="authenticated-user"),

    # Profiles
    path("profiles", ProfilesView.as_view(), name="profiles"),
    path("profile", ProfileView.as_view(), name="profile"),
    
    # Posts
    path("posts", PostView.as_view(), name="posts"),
    path("posts/<int:post_id>", PostView.as_view(), name="post-detail"),

    # Comments
    path("posts/<int:post_id>/comments", CommentView.as_view(), name="post-comments"),
    path("comments/<int:comment_id>", CommentView.as_view(), name="comment-detail"),

    # Experience
    path("profile/experience", ExperienceView.as_view(), name="add-experience"),
    path("profile/experience/<int:exp_id>", ExperienceView.as_view(), name="delete-experience"),

    # Education
    path("profile/education", EducationView.as_view(), name="add-education"),
    path("profile/education/<int:edu_id>", EducationView.as_view(), name="delete-education"),
]
