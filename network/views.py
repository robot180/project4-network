from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from django.contrib.auth.decorators import login_required

#imports included by me:
from .models import *
from .forms import *
from django.contrib import messages
from django.http import JsonResponse
from django.core.serializers import serialize
import json
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt


def index(request):
    # get all the posts in the db and filter by timestamp
    # this returns a queryset that needs to paginated. a queryset is as python collection of django models (it looks almost like a list)
    allposts = Post.objects.order_by("-timestamp").all()
    if len(allposts) == 0:
        return render(request, "network/index.html", {
        "form": PostForm(),

        })
    # if request.user in User.objects.all():
    #     print("found user")
    # for post in allposts:
    #     print(post.timestamp)
    #     if request.user in post.liked_by.all():
    #         print(f'Post {post} liked by {request.user}')

    # if request.user.is_authenticated:
    #     if request.user in User.objects.
    page = Paginator(allposts,10) #paginates the queryset so that html will only load 10 instead of all
    # print(f'hello there: {page.count}')
    # print(page.count)
    # print(page.num_pages)
    # print(f'next page #: {page.page_range}')
    #print(f'allposts after Paginator: {page}')
    page_number= request.GET.get('page', 1) #the 1 isn't necessary, it defaults to page=1 if a page is not provided
    # print(f'page list: {page_list}')
    allposts = page.get_page(page_number)
    # print(f'page object paginator method: {allposts.paginator}')
    # print(f'allposts after get_page: {allposts}')

    # print(allposts.has_previous())
    # print(allposts.has_next())
    # print(allposts.next_page_number)
    return render(request, "network/index.html", {
        "form": PostForm(),
        "allposts":allposts,
    })



def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@login_required(login_url='/login')
def newPost(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            #print("form valid")
            form.instance.author=request.user
            form.save()
            return HttpResponseRedirect(reverse("index"))
        else:
            messages.warning(request, "Please write something. Character limit is 450")
            print("form invalid")
            return render(request, "network/newpost.html", {
                "form": form,
            })

    elif request.method == "GET":
        return render(request, "network/newpost.html", {
            "form": PostForm(),
        })


#https://stackoverflow.com/questions/66055988/django-how-to-turn-a-page-object-to-json

@csrf_exempt
@login_required(login_url='/login')
def submit_changes(request, postid):
    # Query for requested post
    if request.method == "PUT":
        try:
            post = Post.objects.get(pk=postid)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post not found."}, status=404)
        #use json.loads to change data in the body variable to a python dict
        data = json.loads(request.body)
        # print(data)
        # print(type(data))
        # check if the key call "editedpost" exists in the data python dict
        if data.get("editedpost") is not None:
            if post.author == request.user:
                #update the body of the queried post and save it in the database
                post.body = data["editedpost"]
                if len(post.body) > 450:
                    return JsonResponse({"error": "Post is limited to 450 characters."}, status=404)
                post.save()
                print("saved")
                # the post is the same, but had to use filter because the JsonReponse can't accept a single model
                # get returns a single Post model. filter returns the same model, but in the form of a queryset, which Jsonresponse accepts
                post = Post.objects.filter(author=request.user, pk=postid)
                # print(post)
                post = serialize("json", post)
                post = json.loads(post)
                return JsonResponse(post, safe=False, status=200)
        # elif data.get("user") is not None: this code checks if the key (not value) exists in the python dict and it's the same as the line below
        elif "user" in data:
            #get a queryset of users who like this post and and check if current user is in that queryset
            liked_by = post.liked_by.all()
            print(liked_by)
            if request.user in liked_by:
                post.liked_by.remove(request.user)
            else:
                post.liked_by.add(request.user)
            liked_by = post.liked_by.all()
            print(liked_by)
            newlike_count = liked_by.count()
            return JsonResponse({"newlike_count": newlike_count}, status=200)



def profile(request, username_profile):
    selected_user = username_profile
    selected_user = User.objects.get(username=selected_user)
    # print(selected_user.followers.all()) looks like i can access this information in Django template even i only pass selected_user as the context
    followers = selected_user.followers.all()
    userz_posts = Post.objects.order_by("-timestamp").filter(author=selected_user)
    #print(userz_posts)
    #print(selected_user.posts.order_by("timestamp").all()) exactly the same as userz_posts
    # print(userz_posts)
    page = Paginator(userz_posts,10)
    #request.GET.get('page', 1) doesn't actually need the 1, it defaults to 1 if page number is not provided?
    page_number= request.GET.get('page', 1)
    userz_posts = page.get_page(page_number)
    #get queryset of users this user follows:
    allusers = User.objects.exclude(username=selected_user)
    # print(allusers)
    following = []
    for user in allusers:
        if selected_user in user.followers.all():
            following.append(user)
    # print(following)
    # print(len(following))
    return render(request, "network/profile.html", {
        "allposts":userz_posts,
        "selected_user":selected_user,
        "following" : following
    })

@csrf_exempt
@login_required(login_url='/login')
def follow(request):
    info = json.loads(request.body)
    # print(info)
    selected_user = info.get("selected_user")
    selected_user = User.objects.get(username=selected_user)
    followers = selected_user.followers.all()
    print(followers)
    if request.user == selected_user:
        print("can't follow self")
        return HttpResponse("Can't follow self", status=204)
    if request.user not in followers:
        # print("followed")
        #followers.append(request.user) cannot append to queryset
        selected_user.followers.add(request.user)
  
    elif request.user in followers:
        # selected_user.followers.get(user=request.user).delete()
        selected_user.followers.remove(request.user)
    selected_user.save()
    new_followers_count = selected_user.followers.all().count()
    
    return JsonResponse({"newfollowersCount": new_followers_count}, status=200)
    return HttpResponse(status=204)


#display only posts from users that logged-in user follows
@login_required(login_url='/login')
def following(request):
    allusers = User.objects.all()
    # print(type(allusers))
    # for element in allusers:
    #     print(type(element))
    following = []
    for user in allusers:
        if request.user in user.followers.all():
            following.append(user)
    # print(following)
    # for element in following:
    #     print(type(element))
    followedposts = Post.objects.order_by("-timestamp").filter(author__in=following).all()
    print(followedposts)
    page = Paginator(followedposts,10)
    page_number= request.GET.get('page')
    # print(f'page list: {page_list}')
    followedposts = page.get_page(page_number)
    return render(request, "network/following.html", {
    "allposts": followedposts

    })