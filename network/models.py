from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    followers = models.ManyToManyField("self", symmetrical=False, blank=True)


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="posts", null=True)
    title = models.CharField(max_length=100, blank=True, null=True )
    body = models.TextField(max_length=450, blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    liked_by = models.ManyToManyField(User, related_name="postsliked")
    # total_likes = models.PositiveBigIntegerField(default=0) don't need bc this is just the count of liked_by

    def __str__(self):
        return f"{self.id}: {self.author} wrote: {self.body} on {self.timestamp}"
    
    # def get_total_likes(self, instance):
    #     return instance.liked_by.count