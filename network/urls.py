
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("newPost", views.newPost, name="newPosturl"),
    path("profile/<str:username_profile>", views.profile, name="profileurl"),
    path("following", views.following, name="following_url"),

    # API Routes
    path("edit/<int:postid>", views.submit_changes, name="submit_changes_url"),
    path("follow", views.follow, name="follow_url"),
]

