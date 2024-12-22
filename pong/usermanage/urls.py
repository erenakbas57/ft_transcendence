from django.urls import path
from . import views


urlpatterns = [
    path('', views.welcome_view, name='welcome'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    path('404/', views.error_404_view, name='404'),

    path('home/', views.home_view, name='home'),

    path('profile/<str:username>/', views.profile_view, name='profile'),
    path('profile/<str:username>/edit/', views.edit_profile, name='edit_profile'),
    path('profile/<str:username>/change_password/', views.change_password, name='change_password'),

    path('follow_unfollow_user/<str:username>/', views.follow_unfollow_user, name='follow_unfollow_user'),
    path('unfollow_user/<str:username>/', views.unfollow_user, name='unfollow_user'),
    path('search/', views.search_view, name='search'),
    path('friends/', views.friends_view, name='friends'),
    path('leaderboard', views.leaderboard_view, name='leaderboard'),

    path('login/42/callback/', views.callback, name='42_callback'),
    path('login_with_42/', views.login_with_42, name='login_with_42'),
    path('set_offline/', views.set_user_offline, name='set_user_offline'),
]
