from django.contrib import admin
from .models import CustomUser, Game

admin.site.register(CustomUser)
admin.site.register(Game)