from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AvailabilityView, AppointmentViewSet

router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('availability/', AvailabilityView.as_view(), name='availability'),
    path('', include(router.urls)),
]
