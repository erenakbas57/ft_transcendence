from django.contrib import admin
from .models import CustomUser, Game
# Register your models here.
admin.site.register(CustomUser) # CustomUser modelini admin paneline ekle
admin.site.register(Game) # Game modelini admin paneline ekle