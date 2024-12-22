from django.contrib import admin
from django.urls import path
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('usermanage.urls')),
    path('', include('game.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

handler404 = 'usermanage.views.error_404_view'

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)