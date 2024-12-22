
from pathlib import Path
from os import environ
from django.contrib.messages import constants as message_constants
from dotenv import load_dotenv

MESSAGE_TAGS = {
    message_constants.DEBUG: 'secondary',
    message_constants.INFO: 'info',
    message_constants.SUCCESS: 'success',
    message_constants.WARNING: 'warning',
    message_constants.ERROR: 'danger',
}

ALLOWED_HOSTS = [ '*' ]


BASE_DIR = Path(__file__).resolve().parent.parent

dotenv_path = BASE_DIR.parent / '.env'
load_dotenv(dotenv_path)

DEBUG = False

OAUTH2_TOKEN_URL = environ.get('OAUTH2_TOKEN_URL')
OAUTH2_AUTHORIZE_URL = environ.get('OAUTH2_AUTHORIZE_URL')
OAUTH2_API_URL = environ.get('OAUTH2_API_URL')
REDIRECT_URI = environ.get('REDIRECT_URI')


CLIENT_ID = environ.get('CLIENT_ID')
CLIENT_SECRET = environ.get('CLIENT_SECRET')

SECRET_KEY = environ.get('DJANGO_SECRET_KEY')

INSTALLED_APPS = [
    'usermanage',
    'game',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'corsheaders',

    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.oauth2',
]

CORS_ALLOW_ALL_ORIGINS = True
SOCIALACCOUNT_PROVIDERS = {
    'oauth2': {
        'SCOPE': ['read_user', 'profile'],
        'AUTH_PARAMS': {},
        'OAUTH2_TOKEN_URL': OAUTH2_TOKEN_URL,
        'OAUTH2_AUTHORIZE_URL': OAUTH2_AUTHORIZE_URL,
        'OAUTH2_API_URL': OAUTH2_API_URL,
    }
}

SOCIALACCOUNT_ADAPTER = 'usermanage.socialaccount.adapters.DefaultSocialAccountAdapter'


LOGIN_REDIRECT_URL = '/home'
AUTH_USER_MODEL = 'usermanage.CustomUser'
LOGIN_URL = '/login'


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

ROOT_URLCONF = 'project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [ BASE_DIR / 'templates' ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'project.wsgi.application'


# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': environ.get('DB_NAME'),
        'USER': environ.get('DB_USER'),
        'PASSWORD': environ.get('DB_PASSWORD'),
        'HOST': environ.get('DB_HOST'),
        'PORT': environ.get('DB_PORT'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static',]
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = 'media/'


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

SECURE_SSL_REDIRECT = False
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

SECURE_HSTS_SECONDS = 3628800
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
