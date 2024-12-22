import re
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.forms import PasswordChangeForm
from .models import CustomUser, Game
from .forms import CustomUserCreationForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
import requests
from django.core.files.base import ContentFile
from django.conf import settings
import os
from django.db.models import Q
from django.views.decorators.cache import  never_cache
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator

def error_404_view(request, exception):
    return render(request, '404.html', {'is_error_page': True}, status=404)

@never_cache
def welcome_view(request):
    if request.user.is_authenticated:
        return redirect('home')
    return render(request, 'welcome.html')

@never_cache
def register_view(request):
    if request.user.is_authenticated:
        return redirect('home')
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST, request.FILES)
        password = request.POST.get('password1')
        if form.is_valid():
            user = form.save()
            messages.success(request, "You are now registered.")
            return JsonResponse({'success': True, 'message': 'You are now registered.'})
        else:
            if (CustomUser.objects.filter(username=request.POST.get('username')).exists()):
                messages.error(request, "This username is already in use.")
            elif (CustomUser.objects.filter(email=request.POST.get('email')).exists()):
                messages.error(request, "This email is already in use.")
            elif '@student.42' in request.POST.get('email'):
                messages.error(request, "Emails with @student.42 are not allowed.")
            elif (request.POST.get('password1') != request.POST.get('password2')):
                messages.error(request, "Passwords do not match.")
            elif (len(request.POST.get('password1')) < 8):
                messages.error(request, "Password must be at least 8 characters long.")
            elif (len(request.POST.get('password1')) > 128):
                messages.error(request, "Password must be at most 128 characters long.")
            elif not (re.search(r'[a-z]', password) and
                                re.search(r'[A-Z]', password) and
                                re.search(r'\d', password) and
                                re.search(r'[!@#$%^&*(),.?":{}|<>]', password)):
                            messages.error(request, "Password must contain at least lowercase, uppercase, number and special character.")
            return JsonResponse({'success': False, 'message': 'Invalid input.'})
    else:
        form = CustomUserCreationForm()
    return render(request, 'usermanage/register.html', {'form': form})


@never_cache
def login_view(request):
    if request.user.is_authenticated:
        return redirect('home')
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            user_profile = CustomUser.objects.get(username=user.username)
            user_profile.is_online = True
            user_profile.save()
            messages.success(request, "You are now logged in.")
            login(request, user)
            return JsonResponse({'success': True, 'message': 'You are now logged in.'})
        else:
            messages.error(request, "Invalid username or password.")
            return JsonResponse({'success': False, 'message': 'Invalid username or password.'})
    else:
        form = AuthenticationForm()
    return render(request, 'usermanage/login.html')


@login_required
@never_cache
def logout_view(request):
    user_profile = CustomUser.objects.get(username=request.user.username)
    user_profile.is_online = False
    user_profile.save()
    logout(request)
    return redirect('login')

@login_required
@never_cache
def home_view(request):
    user = request.user
    return render(request, "home.html", {'user': user})

@login_required
@never_cache
def friends_view(request):
    user = request.user
    friends = user.following.all()
    friends_status = [
        {
            "username": friend.username,
            "first_name": friend.first_name,
            "last_name": friend.last_name,
            "avatar_url": friend.avatar.url if friend.avatar else None,
            "is_online": friend.is_online,
        }
        for friend in friends
    ]
    return render(request, "friends.html", {'friends_status': friends_status, 'user': user})

@csrf_exempt
@login_required
def set_user_offline(request):
    user = request.user
    user.is_online = False
    user.save()
    return JsonResponse({"status": "offline"})


@login_required
@never_cache
def leaderboard_view(request):
    users = CustomUser.objects.all().exclude(username="mr.smith").exclude(username="neo").order_by('-mp')[:10]
    users_with_rank = [{'rank': index + 1, 'user': user} for index, user in enumerate(users)]

    user_first = users_with_rank[0] if len(users_with_rank) > 0 else None
    user_second = users_with_rank[1] if len(users_with_rank) > 1 else None
    user_third = users_with_rank[2] if len(users_with_rank) > 2 else None
    users_other = users_with_rank[3:] if len(users_with_rank) > 3 else []
    return render(request, 'leaderboard.html', {
        'user_first': user_first,
        'user_second': user_second,
        'user_third': user_third,
        'users_other': users_other,
    })

@login_required
@never_cache
def profile_view(request, username):
    user = get_object_or_404(CustomUser, username=username)
    is_see_stats = False
    if user == request.user or request.user in user.followers.all():
        is_see_stats = True
    rps_games = Game.objects.filter((Q(user1=user) | Q(user2=user)) & Q(game_type=2)).order_by('-user1')
    pong_games = Game.objects.filter((Q(user1=user) | Q(user2=user)) & Q(game_type=1)).order_by('-user1')
    if (user.rps_total_matches > 0):
        win_rate_rps = round((user.rps_total_wins / user.rps_total_matches) * 100, 2)
    else:
        win_rate_rps = 0
    if (user.pong_total_matches > 0):
        win_rate_pong = round((user.pong_total_wins / user.pong_total_matches) * 100, 2)
    else:
        win_rate_pong = 0
    if not (request.user.is_authenticated):
        return render(request, 'usermanage/login.html')

    pong_paginator = Paginator(pong_games, 10)
    pong_page_number = request.GET.get('pong_page', 1)
    pong_page = pong_paginator.get_page(pong_page_number)

    rps_paginator = Paginator(rps_games, 10)
    rps_page_number = request.GET.get('rps_page', 1)
    rps_page = rps_paginator.get_page(rps_page_number)
    return render(request, 'usermanage/profile.html',
                  {'user': user, 'rps_games': rps_games, 'pong_games': pong_games,
                   'win_rate_rps' : win_rate_rps, 'win_rate_pong' : win_rate_pong,
                   'pong_page': pong_page,'rps_page': rps_page, 'stats': is_see_stats})


@login_required
@never_cache
def edit_profile(request, username):
    user = get_object_or_404(CustomUser, username=username)

    if request.user != user:
        messages.error(request, "You are not authorized to edit this profile.")
        return redirect('edit_profile', username=request.user.username)

    if request.method == 'POST':
        if 'username' in request.POST and (request.POST.get('username') != user.username and CustomUser.objects.filter(username=request.POST.get('username')).exists()):
            messages.error(request, "This username is already in use.")
            return JsonResponse({'error': 'This username is already in use.', 'username': user.username}, status=400)
        for char in request.POST.get('username'):
            if not (char.isalpha() or char.isdigit() or char in "._-"):
                messages.error(request, "Username can only contain letters, numbers, dots, underscores, or hyphens.")
                return JsonResponse({'error': 'Username can only contain letters, numbers, dots, underscores, or hyphens.', 'username':user.username}, status=400)
        if 'email' in request.POST and (request.POST.get('email') != user.email and CustomUser.objects.filter(email=request.POST.get('email')).exists()):
            messages.error(request, "This email is already in use.")
            return JsonResponse({'error': 'This email is already in use.', 'username': user.username}, status=400)
        if '@student.42' in request.POST.get('email'):
            messages.error(request, "Emails with '@student.42' are not allowed.")
            return JsonResponse({'error': 'This email is already in use.', 'username': user.username}, status=400)

        user.first_name = request.POST.get('first_name', user.first_name)
        user.last_name = request.POST.get('last_name', user.last_name)
        user.email = request.POST.get('email', user.email)
        user.username = request.POST.get('username', user.username)

        if 'avatar' in request.FILES:
            user.avatar = request.FILES['avatar']

        user.save()
        messages.success(request, "Your profile was successfully updated!")
        return JsonResponse({'success': 'Your profile was successfully updated!', 'username': user.username})

    return render(request, 'usermanage/edit_profile.html', {'user': user})


@login_required
@never_cache
def change_password(request, username):
    user = get_object_or_404(CustomUser, username=username)

    if request.user != user:
        messages.error(request, "You are not authorized to change this password.")
        return redirect('change_password', username=request.user.username)

    if request.method == 'POST':
        form = PasswordChangeForm(user, request.POST)
        if form.is_valid():
            form.save()
            update_session_auth_hash(request, form.user)
            messages.success(request, "Your password was successfully updated!")
            return JsonResponse({'success': True, 'message': 'You are now registered.', 'username': user.username})
        else:
            if (request.POST.get('new_password1') != request.POST.get('new_password2')):
                messages.error(request, "New passwords do not match.")
            elif (request.POST.get('old_password') == request.POST.get('new_password1')):
                messages.error(request, "New password cannot be the same as the old password.")
            elif (not user.check_password(request.POST.get('old_password'))):
                messages.error(request, "Invalid old password.")
            elif (len(request.POST.get('new_password1')) < 8):
                messages.error(request, "Password must be at least 8 characters long.")
            elif (len(request.POST.get('new_password1')) > 128):
                messages.error(request, "Password must be at most 128 characters long.")
            elif (request.POST.get('new_password1').isalpha() or request.POST.get('new_password1').isdigit()):
                messages.error(request, "Password must contain both letters and numbers.")
            return JsonResponse({'success': False, 'message': 'Invalid input.', 'username': user.username})
    else:
        form = PasswordChangeForm(user)

    return render(request, 'usermanage/change_password.html', {'form': form, 'user': user})

@never_cache
@login_required
def search_view(request):
    if request.method == "POST" and request.headers.get("X-Requested-With") == "XMLHttpRequest":
        search_query = request.POST.get("search_query", "")
        if search_query:
            # Kullanıcı sorgusu
            users = CustomUser.objects.filter(
                Q(username__icontains=search_query) |
                Q(first_name__icontains=search_query) |
                Q(last_name__icontains=search_query)
            ).exclude(username=request.user.username).exclude(is_superuser=True).distinct().values(
                "username", "email", "first_name", "last_name", "avatar"
            )

            user_list = []
            for user in users:
                user_obj = CustomUser.objects.get(username=user["username"])
                user["is_following"] = request.user in user_obj.followers.all()
                user["avatar"] = (
                    settings.MEDIA_URL + user["avatar"]
                    if user["avatar"]
                    else settings.MEDIA_URL + "avatars/default.png"
                )
                user_list.append(user)

            unique_users = {user["username"]: user for user in user_list}.values()

            return JsonResponse({"success": True, "results": list(unique_users)})
        else:
            return JsonResponse({"success": False, "message": "No query provided."})
    return render(request, "search.html")



@never_cache
@login_required
def follow_unfollow_user(request, username):
    target_user = get_object_or_404(CustomUser, username=username)

    if target_user in request.user.following.all():
        request.user.following.remove(target_user)
        target_user.followers.remove(request.user)
        action = 'unfollow'
        message = f"You unfollowed {target_user.username}."
    else:
        request.user.following.add(target_user)
        target_user.followers.add(request.user)
        action = 'follow'
        message = f"You are now following {target_user.username}."

    return JsonResponse({
        'success': True,
        'action': action,
        'message': message,
        'username': target_user.username,
    })


@never_cache
@login_required
def unfollow_user(request, username):
    if request.method == 'POST':
        target_user = get_object_or_404(CustomUser, username=username)
        if target_user in request.user.following.all():
            request.user.following.remove(target_user)
            target_user.followers.remove(request.user)
            return JsonResponse({'success': True, 'action': 'unfollow', 'username': target_user.username})
        else:
            return JsonResponse({'success': False, 'message': 'You are not following this user.'})
    return JsonResponse({'success': False, 'message': 'Invalid request method.'})

@never_cache
def login_with_42(request):
    client_id = settings.CLIENT_ID
    client_secret = settings.CLIENT_SECRET
    redirect_uri = settings.REDIRECT_URI

    authorize_url = f"{settings.OAUTH2_AUTHORIZE_URL}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
    return redirect(authorize_url)


@never_cache
def callback(request):
    code = request.GET.get('code')
    if not code:
        return redirect('login')

    data = {
        'grant_type': 'authorization_code',
        'client_id': settings.CLIENT_ID,
        'client_secret': settings.CLIENT_SECRET,
        'code': code,
        'redirect_uri': settings.REDIRECT_URI,
    }

    response = requests.post(settings.OAUTH2_TOKEN_URL, data=data)
    if response.status_code != 200:
        return redirect('login')

    token_data = response.json()
    access_token = token_data.get('access_token')

    if not access_token:
        return redirect('login')

    user_data = requests.get(settings.OAUTH2_API_URL, headers={'Authorization': f'Bearer {access_token}'})
    if user_data.status_code != 200:
        return redirect('login')

    user_info = user_data.json()
    if CustomUser.objects.filter(email=user_info["email"]).exists():
        user = CustomUser.objects.get(email=user_info["email"])
        user.is_online = True
        user.save()
    else:
        username = user_info["login"]
        if CustomUser.objects.filter(username=user_info["login"]).exists():
            username = user_info["login"] + "42"
        email = user_info.get("email", "")
        first_name = user_info.get("first_name", "")
        last_name = user_info.get("last_name", "")
        user = CustomUser.objects.create(username=username, email=email, first_name = first_name, last_name = last_name, is_42 = True )
        user.set_unusable_password()
        user.is_online = True
        user.save()
        image_url = (user_info.get("image", {}).get("link"))
        response = requests.get(image_url)

        if response.status_code == 200:
            media_directory = settings.MEDIA_ROOT

            filename = f"{user_info['login']}.jpg"
            file_path = os.path.join(media_directory, filename)

            with open(file_path, "wb") as file:
                file.write(response.content)

            with open(file_path, "rb") as file:
                user.avatar.save(filename, ContentFile(file.read()), save=True)


    messages.success(request, "You are now logged in with 42.")
    login(request, user)
    return redirect('home')
