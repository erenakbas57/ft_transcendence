
from datetime import datetime, timezone
import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.forms import PasswordChangeForm
from usermanage.models import CustomUser, Game
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
import requests
from django.core.files.base import ContentFile
from django.conf import settings
import os
from django.core.paginator import Paginator
from django.db.models import Q  # SQL 'OR' benzeri aramalar için
from django.template.loader import render_to_string

@login_required
def pong_home(request):
    return render(request, 'pong/pong.html')

@login_required
def pong_ai(request):
    return render(request, 'pong/pong-ai.html')

@login_required
def pong_local(request):
    return render(request, 'pong/pong-local.html')

@login_required
def pong_local_tournament(request):
    return render(request, 'pong/pong-tournament.html')


@login_required
def rps_ai(request):
    return render(request, 'rps/rps-ai.html')

@login_required
def rps_game_save(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        # Kullanıcı bilgilerini al
        username = data.get('username')
        ai_name = data.get('ai_name')
        player_score = data.get('player_score')
        ai_score = data.get('ai_score')
        game_duration = data.get('duration')
        
        # Kullanıcıları al
        ai  = CustomUser.objects.get(username=ai_name)
        user1 = request.user
        user2 = ai  # Burada 'AI' olduğu için user2 AI'yi temsil eder

        # Oyunun tipini belirle (RPS için 2)
        game_type = 2  # Rock Paper Scissors

        # Yeni bir Game kaydı oluştur
        game = Game(
            game_type=game_type,
            user1=user1,
            user2=user2,  # AI'yi temsil etmek için user2'yi AI olarak ayarlıyoruz
            user1_score=player_score,
            user2_score=ai_score,
            time_duration=game_duration,
            date=datetime.now()  # Oyun zamanını şu an olarak ayarlıyoruz
        )
        print(game.game_type)
        print(game.user1)
        print(game.user2)
        print(game.user1_score)
        print(game.user2_score)
        print(game.time_duration)
        print(game.date)
        # Oyun kaydını kaydet
        game.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'fail'})