from django.apps import AppConfig


class UsermanageConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'usermanage'

    def ready(self):
        import usermanage.signals


