from django.urls import path
from . import views


urlpatterns = [
    path('pong/', views.pong_home, name='pong'),
    path('pong-ai/', views.pong_ai, name='pong-ai'),
    path('pong-local/', views.pong_local, name='pong-local'),
    path('pong-local-tournament/', views.pong_local_tournament, name='pong-local-tournament'),

    path('rps-ai/', views.rps_ai, name='rps-ai'),
    
    path('rps-game-save/', views.rps_game_save, name='rps-game-save'),
    
]