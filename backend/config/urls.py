from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from common.views import AdminDashboardStatsView

urlpatterns = [
    path('admin/', admin.site.urls),

    # API Endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/', include('salons.urls')),
    path('api/', include('appointments.urls')),
    path('api/', include('reviews.urls')),
    path('api/', include('notifications.urls')),
    path('api/admin/stats/', AdminDashboardStatsView.as_view(), name='admin_stats'),

    # Swagger / OpenAPI Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
