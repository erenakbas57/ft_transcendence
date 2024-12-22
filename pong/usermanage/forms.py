import re
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
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if (password1 != password2):
            raise forms.ValidationError("Password does not match")
        elif not (re.search(r'\d', password2) and re.search(r'[A-Z]', password2) and re.search(r'[a-z]', password2) and re.search(r'[!@#$%^&*()_+]', password2)):
            raise forms.ValidationError("Password must contain at least digit, uppercase, lowercase and special character.")
        return password2

    def clean_username(self):
        username = self.cleaned_data.get('username')
        return username

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if '@student.42' in email:
            raise forms.ValidationError("Emails with @student.42 are not allowed.")
        return email


class EditProfileForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'username', 'email', 'avatar']  # Düzenlemek istediğiniz alanlar
