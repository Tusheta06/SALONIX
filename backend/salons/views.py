from django.db import models
from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from common.permissions import IsSalonOwnerOrManager, IsAdminUser, IsStaffMember
from .models import Category, Salon, SalonImage, Service, Staff, WorkingHour, StaffLeave
from .serializers import (
    CategorySerializer,
    SalonListSerializer,
    SalonDetailSerializer,
    SalonImageSerializer,
    ServiceSerializer,
    StaffSerializer,
    WorkingHourSerializer,
    StaffLeaveSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [permissions.AllowAny()]


class SalonViewSet(viewsets.ModelViewSet):
    queryset = Salon.objects.filter(is_active=True, is_approved=True)

    def get_serializer_class(self):
        if self.action in ['list']:
            return SalonListSerializer
        return SalonDetailSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsSalonOwnerOrManager()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = Salon.objects.all()
        user = self.request.user
        if not (user.is_authenticated and user.role == 'ADMIN'):
            if user.is_authenticated and user.role in ['SALON_OWNER', 'SALON_MANAGER']:
                qs = qs.filter(models.Q(is_active=True, is_approved=True) | models.Q(owner=user))
            else:
                qs = qs.filter(is_active=True, is_approved=True)

        search = self.request.query_params.get('search', None)
        city = self.request.query_params.get('city', None)
        category_id = self.request.query_params.get('category_id', None)
        min_rating = self.request.query_params.get('min_rating', None)

        if search:
            qs = qs.filter(models.Q(name__icontains=search) | models.Q(description__icontains=search) | models.Q(address__icontains=search))
        if city:
            qs = qs.filter(city__iexact=city)
        if category_id:
            qs = qs.filter(services__category_id=category_id).distinct()
        if min_rating:
            qs = qs.filter(rating__gte=float(min_rating))

        return qs

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[IsSalonOwnerOrManager])
    def my_salon(self, request):
        salon = Salon.objects.filter(owner=request.user).first()
        if not salon:
            return Response({
                'success': False,
                'message': 'No salon registered for this owner'
            }, status=status.HTTP_404_NOT_FOUND)
        serializer = SalonDetailSerializer(salon)
        return Response({
            'success': True,
            'message': 'Salon details fetched',
            'data': serializer.data
        })


class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer

    def get_queryset(self):
        qs = Service.objects.all()
        salon_id = self.request.query_params.get('salon_id', None)
        category_id = self.request.query_params.get('category_id', None)
        if salon_id:
            qs = qs.filter(salon_id=salon_id)
        if category_id:
            qs = qs.filter(category_id=category_id)
        return qs.filter(is_active=True)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsSalonOwnerOrManager()]
        return [permissions.AllowAny()]


class StaffViewSet(viewsets.ModelViewSet):
    serializer_class = StaffSerializer

    def get_queryset(self):
        qs = Staff.objects.all()
        salon_id = self.request.query_params.get('salon_id', None)
        if salon_id:
            qs = qs.filter(salon_id=salon_id)

        user = self.request.user
        if user.is_authenticated and user.role == 'STAFF':
            # Staff user can see active staff in their salon or themselves
            staff_member = Staff.objects.filter(models.Q(user=user) | models.Q(email=user.email)).first()
            if staff_member:
                qs = qs.filter(salon=staff_member.salon)

        return qs.filter(is_active=True)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsSalonOwnerOrManager()]
        return [permissions.AllowAny()]

    @action(detail=False, methods=['get', 'patch'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        user = request.user
        staff_member = Staff.objects.filter(models.Q(user=user) | models.Q(email=user.email)).first()
        if not staff_member:
            return Response({
                'success': False,
                'message': 'No staff profile associated with this user account'
            }, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'GET':
            serializer = StaffSerializer(staff_member)
            return Response({
                'success': True,
                'message': 'Staff profile fetched',
                'data': serializer.data
            })

        elif request.method == 'PATCH':
            # Staff member updating their own profile
            serializer = StaffSerializer(staff_member, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({
                'success': True,
                'message': 'Staff profile updated successfully',
                'data': serializer.data
            })


class WorkingHourViewSet(viewsets.ModelViewSet):
    serializer_class = WorkingHourSerializer

    def get_queryset(self):
        qs = WorkingHour.objects.all()
        salon_id = self.request.query_params.get('salon_id', None)
        if salon_id:
            qs = qs.filter(salon_id=salon_id)
        return qs

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsSalonOwnerOrManager()]
        return [permissions.AllowAny()]


class StaffLeaveViewSet(viewsets.ModelViewSet):
    serializer_class = StaffLeaveSerializer

    def get_queryset(self):
        qs = StaffLeave.objects.all()
        user = self.request.user
        if user.is_authenticated:
            if user.role == 'STAFF':
                qs = qs.filter(models.Q(staff__user=user) | models.Q(staff__email=user.email))
            elif user.role in ['SALON_OWNER', 'SALON_MANAGER']:
                qs = qs.filter(staff__salon__owner=user)

        staff_id = self.request.query_params.get('staff_id', None)
        if staff_id and user.role != 'STAFF':
            qs = qs.filter(staff_id=staff_id)

        return qs

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'STAFF':
            staff_member = Staff.objects.filter(models.Q(user=user) | models.Q(email=user.email)).first()
            if not staff_member:
                raise permissions.exceptions.PermissionDenied('No staff profile associated with this account.')
            serializer.save(staff=staff_member)
        else:
            serializer.save()
