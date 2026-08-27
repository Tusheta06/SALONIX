from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet,
    SalonViewSet,
    SalonImageViewSet,
    ServiceViewSet,
    StaffViewSet,
    WorkingHourViewSet,
    StaffLeaveViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'salons', SalonViewSet, basename='salon')
router.register(r'salon-images', SalonImageViewSet, basename='salonimage')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'staff', StaffViewSet, basename='staff')
router.register(r'working-hours', WorkingHourViewSet, basename='workinghour')
router.register(r'leaves', StaffLeaveViewSet, basename='staffleave')

urlpatterns = [
    path('', include(router.urls)),
]
