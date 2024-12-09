from email import message
from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password1', 'password2', 'avatar', 'first_name', 'last_name')


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def clean_password2(self):
        password2 = self.cleaned_data.get('password2')
        
        return password2

    def clean_username(self):
        
        username = self.cleaned_data.get('username')
        return username

    def clean_email(self):
        
        email = self.cleaned_data.get('email')
        return email


class EditProfileForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'username', 'email', 'avatar']  # Düzenlemek istediğiniz alanlar