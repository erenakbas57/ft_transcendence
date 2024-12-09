
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
from django.db.models import Q  # SQL 'OR' benzeri aramalar için
from django.views.decorators.cache import  never_cache
from django.http import JsonResponse, HttpResponse
from django.conf import settings



def error_404_view(request, exception):
    print("404")
    return render(request, '404.html', status=404)

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
        if form.is_valid():
            user = form.save()
            messages.success(request, "You are now registered.")
            return JsonResponse({'success': True, 'message': 'You are now registered.'})
        else:
            if (CustomUser.objects.filter(username=request.POST.get('username')).exists()):
                messages.error(request, "This username is already in use.")
            elif (CustomUser.objects.filter(email=request.POST.get('email')).exists()):
                messages.error(request, "This email is already in use.")
            elif (request.POST.get('password1') != request.POST.get('password2')):
                messages.error(request, "Passwords do not match.")
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
    print(settings.MEDIA_URL)
    print(settings.CLIENT_SECRET)
    return render(request, "home.html", {'user': user})

@login_required
@never_cache
def friends_view(request):
    user = request.user
    friends = user.following.all()
    return render(request, "friends.html", {'friends': friends, 'user': user})


@login_required
@never_cache
def profile_view(request, username):
    user = get_object_or_404(CustomUser, username=username)
    rps_games = Game.objects.filter((Q(user1=user) | Q(user2=user)) & Q(game_type=2))
    pong_games = Game.objects.filter((Q(user1=user) | Q(user2=user)) & Q(game_type=1))
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
    return render(request, 'usermanage/profile.html', 
                  {'user': user, 'rps_games': rps_games, 'pong_games': pong_games, 
                   'win_rate_rps' : win_rate_rps, 'win_rate_pong' : win_rate_pong})


@login_required
@never_cache
def edit_profile(request, username):
    user = get_object_or_404(CustomUser, username=username)

    if request.user != user:
        return JsonResponse({'error': 'Unauthorized access'}, status=403)

    if request.method == 'POST':
        if 'username' in request.POST and (request.POST.get('username') != user.username and CustomUser.objects.filter(username=request.POST.get('username')).exists()):
            messages.error(request, "This username is already in use.")
            return JsonResponse({'error': 'This username is already in use.'}, status=400)

        if 'email' in request.POST and (request.POST.get('email') != user.email and CustomUser.objects.filter(email=request.POST.get('email')).exists()):
            messages.error(request, "This email is already in use.")
            return JsonResponse({'error': 'This email is already in use.'}, status=400)

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
        return JsonResponse({'error': 'Unauthorized access'}, status=403)
    
    if request.method == 'POST':
        form = PasswordChangeForm(user, request.POST)
        if form.is_valid():
            form.save()
            update_session_auth_hash(request, form.user)
            messages.success(request, "Your password was successfully updated!")
            return JsonResponse({'success': True, 'message': 'You are now registered.'})
        else:
            if (request.POST.get('new_password1') != request.POST.get('new_password2')):
                messages.error(request, "New passwords do not match.")
            elif (request.POST.get('old_password') == request.POST.get('new_password1')):
                messages.error(request, "New password cannot be the same as the old password.")
            elif (not user.check_password(request.POST.get('old_password'))):
                messages.error(request, "Invalid old password.")
            return JsonResponse({'success': False, 'message': 'Invalid input.'})
    else:
        form = PasswordChangeForm(user)
    
    return render(request, 'usermanage/change_password.html', {'form': form, 'user': user})


@login_required
def search_view(request):
    if request.method == "POST" and request.headers.get("X-Requested-With") == "XMLHttpRequest":
        search_query = request.POST.get("search_query", "")
        if search_query:
            users = CustomUser.objects.filter(
                Q(username__icontains=search_query) |
                Q(first_name__icontains=search_query) |
                Q(last_name__icontains=search_query)
            ).values("username", "email", "first_name", "last_name", "avatar", "followers").exclude(username=request.user.username)
            
            for user in users:
                if user['avatar']:
                    avatar = settings.MEDIA_URL + user['avatar']
                    user['avatar'] = avatar
                else:
                    user['avatar'] = settings.MEDIA_URL + 'avatars/default_user.png'
            user_list = list(users)
            
            for user in user_list:
                if request.user in CustomUser.objects.get(username=user['username']).followers.all():
                    user['is_following'] = True
                else:
                    user['is_following'] = False 
            return JsonResponse({"success": True, "results": user_list})
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
            messages.error(request, f"You unfollowed {target_user.username}.")
            return JsonResponse({'success': True, 'action': 'unfollow', 'username': target_user.username})
        else:
            return JsonResponse({'success': False, 'message': 'You are not following this user.'})
    return JsonResponse({'success': False, 'message': 'Invalid request method.'})


# 42 API URL
OAUTH2_TOKEN_URL = 'https://api.intra.42.fr/oauth/token'
OAUTH2_AUTHORIZE_URL = 'https://api.intra.42.fr/oauth/authorize'
OAUTH2_API_URL = 'https://api.intra.42.fr/v2/me'

@never_cache
def login_with_42(request):
    client_id = "u-s4t2ud-6734d68d2909202a4931842ba59cf851e674af595b553d9177541ae673f85ec9"
    client_secret = "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"
    redirect_uri = 'http://localhost:8000//login/42/callback/'

    authorize_url = f"{OAUTH2_AUTHORIZE_URL}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
    return redirect(authorize_url)


@never_cache
def callback(request):
    code = request.GET.get('code')
    if not code:
        return redirect('login')

    data = {
        'grant_type': 'authorization_code',
        'client_id': "u-s4t2ud-6734d68d2909202a4931842ba59cf851e674af595b553d9177541ae673f85ec9",
        'client_secret': "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",
        'code': code,
        'redirect_uri': 'http://localhost:8000//login/42/callback/',
    }

    response = requests.post(OAUTH2_TOKEN_URL, data=data)
    if response.status_code != 200:
        return redirect('login')
    
    token_data = response.json()
    access_token = token_data.get('access_token')

    if not access_token:
        return redirect('login') 

    user_data = requests.get(OAUTH2_API_URL, headers={'Authorization': f'Bearer {access_token}'})
    if user_data.status_code != 200:
        return redirect('login') 
    
    user_info = user_data.json()
    print(user_info.get("image", {}).get("versions", {}).get("medium", ""))
    print(user_info.get("image", {}).get("link", ""))
    if CustomUser.objects.filter(email=user_info["email"]).exists():
        user = CustomUser.objects.get(email=user_info["email"])
    else:
        username = user_info["login"]
        if CustomUser.objects.filter(username=user_info["login"]).exists():
            username = user_info["login"] + "42"
        email = user_info.get("email", "")
        first_name = user_info.get("first_name", "")
        last_name = user_info.get("last_name", "")
        user = CustomUser.objects.create(username=username, email=email, first_name = first_name, last_name = last_name, is_42 = True )
        user.set_unusable_password() 
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

            print(f"Resim başarıyla {file_path} yoluna kaydedildi!")
        else:
            print("Resim indirilemedi!")

    messages.success(request, "You are now logged in with 42.")
    login(request, user)
    return redirect('home')