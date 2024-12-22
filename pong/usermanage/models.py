from django.contrib.auth.models import AbstractUser
from django.db import models
import os
from django.contrib.auth import get_user_model
from django.utils.text import slugify

def user_avatar_upload_path(instance, filename):
    # Kullanıcı adını kullanarak dosya adı oluştur
    username_slug = slugify(instance.username)  # Kullanıcı adını temizleyip slug haline getirir
    extension = os.path.splitext(filename)[1]  # Dosya uzantısını alır
    return f'avatars/{username_slug}{extension}'  # Özel dosya yolu ve adı


class CustomUser(AbstractUser):
    avatar = models.ImageField(upload_to=user_avatar_upload_path, default="default.png", blank=True, null=True, verbose_name="Avatar")
    is_42 = models.BooleanField(default=False, verbose_name="42 User")
    followers = models.ManyToManyField('self', related_name='followed_by', symmetrical=False)
    following = models.ManyToManyField('self', related_name='follows', symmetrical=False)
    is_online = models.BooleanField(default=False, verbose_name="Online Status")
    mp = models.IntegerField(default=0, verbose_name="Matrix Point")

    # Pong için istatistikler
    pong_total_matches = models.IntegerField(default=0, verbose_name="Total Pong Matches")
    pong_total_wins = models.IntegerField(default=0, verbose_name="Total Pong Wins")
    pong_total_losses = models.IntegerField(default=0, verbose_name="Total Pong Losses")
    pong_total_time = models.FloatField(default=0.0, verbose_name="Average Pong Match Duration (seconds)")

    # Rock Paper Scissors için istatistikler
    rps_total_matches = models.IntegerField(default=0, verbose_name="Total RPS Matches")
    rps_total_wins = models.IntegerField(default=0, verbose_name="Total RPS Wins")
    rps_total_losses = models.IntegerField(default=0, verbose_name="Total RPS Losses")
    rps_total_time = models.FloatField(default=0.0, verbose_name="Average RPS Match Duration (seconds)")

    def __str__(self):
        return self.username


class Game(models.Model):
    GAME_NAME_CHOICES = [
        (1, 'Pong'),
        (2, 'Rock Paper Scissors'),
    ]

    game_type = models.IntegerField(choices=GAME_NAME_CHOICES, verbose_name="Game Type")
    user1 = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='user1', verbose_name="User 1")
    user2 = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='user2', verbose_name="User 2")
    user1_score = models.IntegerField(default=0, verbose_name="User 1 Score")
    user2_score = models.IntegerField(default=0, verbose_name="User 2 Score")
    winner = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='winner', verbose_name="Winner")
    loser = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='loser', verbose_name="Loser")
    date = models.DateTimeField(auto_now_add=True, verbose_name="Date")
    time_duration = models.IntegerField(default=0, verbose_name="Time Duration")

    def __str__(self):
        return f"{self.get_game_type_display()} - {self.user1} vs {self.user2}"
 
    def save(self, *args, **kwargs):
        self.update_user_statistics()
        super(Game, self).save(*args, **kwargs)
        
 
    def update_user_statistics(self):
        if self.game_type == 1:  # Pong
            if self.user1_score > self.user2_score:
                self.winner = self.user1
                self.user1.mp += 10
                self.user2.mp -= 10
                self.loser = self.user2
            else:
                self.user2.mp += 10
                self.user1.mp -= 10
                self.winner = self.user2
                self.loser = self.user1
            
            if self.winner == self.user1:
                self.user1.pong_total_wins += 1
                self.user2.pong_total_losses += 1
            else :
                self.user2.pong_total_wins += 1
                self.user1.pong_total_losses += 1
            
            self.user1.pong_total_matches += 1
            self.user1.pong_total_time += self.time_duration
            self.user2.pong_total_matches += 1
            self.user2.pong_total_time += self.time_duration

        else: # Rock Paper Scissors
            if self.user1_score > self.user2_score:
                self.winner = self.user1
                self.user1.mp += 10
                self.user2.mp -= 10
                self.loser = self.user2
            else:
                self.winner = self.user2
                self.user2.mp += 10
                self.user1.mp -= 10
                self.loser = self.user1
            
            if self.winner == self.user1:
                self.user1.rps_total_wins += 1
                self.user2.rps_total_losses += 1
            else :
                self.user2.rps_total_wins += 1
                self.user1.rps_total_losses += 1
            
            self.user1.rps_total_matches += 1
            self.user1.rps_total_time += self.time_duration
            self.user2.rps_total_matches += 1
            self.user2.rps_total_time += self.time_duration

        self.user1.save()
        self.user2.save()