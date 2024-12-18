
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
    return render(request, 'pong/pong-home.html')

@login_required
def pong_ai(request):
    return render(request, 'pong/pong-ai.html')

@login_required
def pong_local(request):
    return render(request, 'pong/pong-local.html')

@login_required
def pong_tournament(request):
    return render(request, 'pong/pong-tournament.html')

def pong_multiplayer(request):
    return render(request, 'pong/pong-multiplayer.html')


@login_required
def rps_ai(request):
    return render(request, 'rps/rps-ai.html')

@login_required
def rps_game_save(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        player_score = data.get('player_score')
        ai_score = data.get('ai_score')
        game_duration = data.get('duration')

        ai  = CustomUser.objects.get(username="mr.smith")
        user1 = request.user
        user2 = ai 
        game_type = 2

        game = Game(
            game_type=game_type,
            user1=user1,
            user2=user2,
            user1_score=player_score,
            user2_score=ai_score,
            time_duration=game_duration,
            date=datetime.now()
        )
        game.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'fail'})

@login_required
def pong_game_save(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        player_score = data.get('player_score')
        ai_score = data.get('ai_score')
        game_duration = data.get('duration')

        ai  = CustomUser.objects.get(username="mr.smith")
        user1 = request.user
        user2 = ai 
        game_type = 1

        game = Game(
            game_type=game_type,
            user1=user1,
            user2=user2,
            user1_score=player_score,
            user2_score=ai_score,
            time_duration=game_duration,
            date=datetime.now()
        )
        game.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'fail'})