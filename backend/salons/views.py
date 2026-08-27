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
    SalonCreateSerializer,
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
    queryset = Salon.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return SalonCreateSerializer
        if self.action == 'list':
            return SalonListSerializer
        return SalonDetailSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'upload_image']:
            return [IsSalonOwnerOrManager()]
        if self.action in ['approve', 'reject']:
            return [IsAdminUser()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = Salon.objects.all()
        user = self.request.user
        
        if user.is_authenticated and (user.role == 'ADMIN' or user.is_superuser):
            approval_status_param = self.request.query_params.get('approval_status', None)
            if approval_status_param:
                qs = qs.filter(approval_status=approval_status_param)
        elif user.is_authenticated and user.role in ['SALON_OWNER', 'SALON_MANAGER']:
            qs = qs.filter(models.Q(is_active=True, is_approved=True, approval_status='APPROVED') | models.Q(owner=user))
        else:
            qs = qs.filter(is_active=True, is_approved=True, approval_status='APPROVED')

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
        user = self.request.user
        if Salon.objects.filter(owner=user).exists():
            raise permissions.exceptions.ValidationError({'detail': 'You already have a registered salon.'})
        
        serializer.save(
            owner=user,
            approval_status=Salon.ApprovalStatus.PENDING,
            is_approved=False
        )

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

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def approve(self, request, pk=None):
        salon = self.get_object()
        salon.approval_status = Salon.ApprovalStatus.APPROVED
        salon.is_approved = True
        salon.rejection_reason = ''
        salon.save()
        return Response({
            'success': True,
            'message': f'Salon "{salon.name}" has been approved.',
            'data': SalonDetailSerializer(salon).data
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def reject(self, request, pk=None):
        salon = self.get_object()
        salon.approval_status = Salon.ApprovalStatus.REJECTED
        salon.is_approved = False
        salon.rejection_reason = request.data.get('reason', 'Requirements not met.')
        salon.save()
        return Response({
            'success': True,
            'message': f'Salon "{salon.name}" has been rejected.',
            'data': SalonDetailSerializer(salon).data
        })

    @action(detail=True, methods=['post'], permission_classes=[IsSalonOwnerOrManager])
    def upload_image(self, request, pk=None):
        salon = self.get_object()
        if salon.owner != request.user and request.user.role != 'ADMIN':
            return Response({'success': False, 'message': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'success': False, 'message': 'No image file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        salon_img = SalonImage.objects.create(
            salon=salon,
            image=image_file,
            alt_text=request.data.get('alt_text', salon.name)
        )
        return Response({
            'success': True,
            'message': 'Image uploaded successfully',
            'data': SalonImageSerializer(salon_img).data
        }, status=status.HTTP_201_CREATED)


class SalonImageViewSet(viewsets.ModelViewSet):
    serializer_class = SalonImageSerializer
    permission_classes = [IsSalonOwnerOrManager]

    def get_queryset(self):
        qs = SalonImage.objects.all()
        salon_id = self.request.query_params.get('salon_id', None)
        if salon_id:
            qs = qs.filter(salon_id=salon_id)
        if self.request.user.role != 'ADMIN':
            qs = qs.filter(salon__owner=self.request.user)
        return qs

    def perform_create(self, serializer):
        salon = serializer.validated_data.get('salon')
        if not salon:
            salon = Salon.objects.filter(owner=self.request.user).first()
            if not salon:
                raise permissions.exceptions.ValidationError({'salon': 'Owner has no salon.'})
        
        if salon.owner != self.request.user and self.request.user.role != 'ADMIN':
            raise permissions.exceptions.PermissionDenied('Cannot upload images to another owner salon.')
        
        serializer.save(salon=salon)


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

        user = self.request.user
        if not (user.is_authenticated and (user.role in ['SALON_OWNER', 'SALON_MANAGER', 'ADMIN'])):
            qs = qs.filter(is_active=True)
        return qs

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsSalonOwnerOrManager()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        salon = serializer.validated_data.get('salon')
        if not salon:
            salon = Salon.objects.filter(owner=self.request.user).first()
            if not salon:
                raise permissions.exceptions.ValidationError({'salon': 'No salon registered for this owner.'})

        if salon.owner != self.request.user and self.request.user.role != 'ADMIN':
            raise permissions.exceptions.PermissionDenied("Cannot manage another owner's salon services.")

        serializer.save(salon=salon)

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.salon.owner != self.request.user and self.request.user.role != 'ADMIN':
            raise permissions.exceptions.PermissionDenied("Cannot manage another owner's salon services.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.salon.owner != self.request.user and self.request.user.role != 'ADMIN':
            raise permissions.exceptions.PermissionDenied("Cannot manage another owner's salon services.")
        instance.delete()


class StaffViewSet(viewsets.ModelViewSet):
    serializer_class = StaffSerializer

    def get_queryset(self):
        qs = Staff.objects.all()
        salon_id = self.request.query_params.get('salon_id', None)
        if salon_id:
            qs = qs.filter(salon_id=salon_id)

        user = self.request.user
        if not (user.is_authenticated and (user.role in ['SALON_OWNER', 'SALON_MANAGER', 'ADMIN'])):
            qs = qs.filter(is_active=True)

        return qs

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsSalonOwnerOrManager()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        salon = serializer.validated_data.get('salon')
        if not salon:
            salon = Salon.objects.filter(owner=self.request.user).first()
            if not salon:
                raise permissions.exceptions.ValidationError({'salon': 'No salon registered for this owner.'})

        if salon.owner != self.request.user and self.request.user.role != 'ADMIN':
            raise permissions.exceptions.PermissionDenied("Cannot add staff to another owner's salon.")

        serializer.save(salon=salon)

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.salon.owner != self.request.user and self.request.user.role != 'ADMIN':
            raise permissions.exceptions.PermissionDenied("Cannot modify staff belonging to another salon.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.salon.owner != self.request.user and self.request.user.role != 'ADMIN':
            raise permissions.exceptions.PermissionDenied("Cannot delete staff belonging to another salon.")
        instance.delete()

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

    def perform_create(self, serializer):
        salon = serializer.validated_data.get('salon')
        if not salon:
            salon = Salon.objects.filter(owner=self.request.user).first()
            if not salon:
                raise permissions.exceptions.ValidationError({'salon': 'No salon registered for this owner.'})

        if salon.owner != self.request.user and self.request.user.role != 'ADMIN':
            raise permissions.exceptions.PermissionDenied("Cannot modify working hours for another owner's salon.")

        serializer.save(salon=salon)


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
