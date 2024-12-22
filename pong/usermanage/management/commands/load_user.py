from django.core.management.base import BaseCommand
from usermanage.models import CustomUser
from django.core.files import File
from os import environ
import json

class Command(BaseCommand):
	def handle(self, *args, **options):
		# Create superuser if not exists
		superuser = environ.get("SUPER_USER")
		supermail = environ.get("SUPER_MAIL")
		superpass = environ.get("SUPER_PASS")
  
		if not CustomUser.objects.filter(username=superuser).exists():
			super_user = CustomUser.objects.create_superuser(superuser, supermail, superpass, first_name="Thomas", last_name="Anderson")
			file = File(open('static/assets/profile/neo.png', "rb"))
			super_user.avatar.save(f"{file.name}.png", file, save=False)
			file.close()
			super_user.is_staff = True
			super_user.is_superuser = True
			super_user.save()
			self.stdout.write(self.style.SUCCESS('Super NEO created successfully.'))

		if not CustomUser.objects.filter(username="mr.smith").exists():
			user = CustomUser.objects.create_user(username="mr.smith", email="mr.smith@matrix.com")
			user.set_unusable_password()
			user.displayname = "MR. SMITH"
			file = File(open('static/assets/profile/smith.png', "rb"))
			user.avatar.save(f"{file.name}.png", file, save=False)
			file.close()
			super_user.is_staff = True
			super_user.is_superuser = True
			user.save()
			self.stdout.write(self.style.SUCCESS('MR. Smith created successfully.'))
   
		user_data = [
            {
                "username": "ea",
                "email": "erenakbas057@gmail.com",
                "password":"123",
                "first_name": "Eren",
                "last_name": "Akbaş"
            },
            {
                "username": "yo",
                "email": "yildizozcan@gmail.com",
                "password":"123",
                "first_name": "Yıldız",
				"last_name": "Özcan"
            },
            {
                "username": "ag",
                "email": "aleynagenc@gmail.com",
                "password":"123",
                "first_name": "Aleyna",
				"last_name": "Genç"
            },
			{
                "username": "oo",
                "email": "oguzhanoksuz@gmail.com",
                "password":"123",
                "first_name": "Oğuzhan",
				"last_name": "Öksüz"
            },
        ]
    
		for data in user_data:
			if not CustomUser.objects.filter(username=data["username"]).exists():
				user = CustomUser.objects.create_user(data["username"], data["email"], data["password"], first_name=data["first_name"], last_name=data["last_name"])
				file = File(open('static/assets/profile/default.png', "rb"))
				file_name = f"{data['username']}.png"
				user.avatar.save(file_name, file, save=False)
				file.close()
				user.save()
				self.stdout.write(self.style.SUCCESS(f'{data["username"].upper()} created successfully.'))

			
		self.stdout.write(self.style.SUCCESS('Data initialization completed successfully.'))


