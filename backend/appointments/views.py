import datetime
from django.db import transaction, models
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, OpenApiParameter
from salons.models import Service, Staff, WorkingHour, StaffLeave
from .models import Appointment
from .serializers import AppointmentSerializer, AppointmentCreateSerializer
from .services import AvailabilityEngine
from notifications.utils import create_notification, notify_admins, format_appointment_datetime
from notifications.models import NotificationType

class AvailabilityView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        parameters=[
            OpenApiParameter('salon_id', int, required=True),
            OpenApiParameter('service_id', int, required=True),
            OpenApiParameter('staff_id', int, required=True),
            OpenApiParameter('date', str, required=True, description='YYYY-MM-DD format')
        ]
    )
    def get(self, request):
        salon_id = request.query_params.get('salon_id')
        service_id = request.query_params.get('service_id')
        staff_id = request.query_params.get('staff_id')
        date_str = request.query_params.get('date')

        if not all([salon_id, service_id, staff_id, date_str]):
            return Response({
                'success': False,
                'message': 'Missing required query parameters: salon_id, service_id, staff_id, date'
            }, status=status.HTTP_400_BAD_REQUEST)

        result = AvailabilityEngine.get_available_slots(salon_id, service_id, staff_id, date_str)
        return Response(result, status=status.HTTP_200_OK if result['success'] else status.HTTP_400_BAD_REQUEST)


class AppointmentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create']:
            return AppointmentCreateSerializer
        return AppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Appointment.objects.all()

        if user.role == 'ADMIN':
            pass
        elif user.role in ['SALON_OWNER', 'SALON_MANAGER']:
            qs = qs.filter(salon__owner=user)
        elif user.role == 'STAFF':
            qs = qs.filter(models.Q(staff__user=user) | models.Q(staff__email=user.email))
        else:
            qs = qs.filter(customer=user)

        salon_id = self.request.query_params.get('salon_id')
        status_param = self.request.query_params.get('status')
        date_param = self.request.query_params.get('date')

        if salon_id:
            qs = qs.filter(salon_id=salon_id)
        if status_param:
            qs = qs.filter(status=status_param)
        if date_param:
            qs = qs.filter(appointment_date=date_param)

        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        salon = serializer.validated_data['salon']
        service = serializer.validated_data['service']
        staff = serializer.validated_data['staff']
        apt_date = serializer.validated_data['appointment_date']
        start_t = serializer.validated_data['start_time']

        duration = datetime.timedelta(minutes=service.duration_minutes)
        start_datetime = datetime.datetime.combine(apt_date, start_t)
        end_t = (start_datetime + duration).time()

        with transaction.atomic():
            # One customer can make only ONE booking per calendar day
            if Appointment.objects.filter(
                customer=request.user,
                appointment_date=apt_date
            ).exclude(status=Appointment.Status.CANCELLED).exists():
                return Response({
                    'success': False,
                    'message': 'You already have a booking on this date. Only one booking per day is allowed.'
                }, status=status.HTTP_400_BAD_REQUEST)

            day_of_week = apt_date.weekday()
            wh = WorkingHour.objects.filter(salon=salon, day_of_week=day_of_week).first()
            if not wh or not wh.is_open:
                return Response({
                    'success': False,
                    'message': 'Salon is closed on the selected date.'
                }, status=status.HTTP_400_BAD_REQUEST)

            if start_t < wh.opening_time or end_t > wh.closing_time:
                return Response({
                    'success': False,
                    'message': f'Appointment time is outside salon working hours ({wh.opening_time.strftime("%H:%M")} - {wh.closing_time.strftime("%H:%M")}).'
                }, status=status.HTTP_400_BAD_REQUEST)

            if StaffLeave.objects.filter(staff=staff, start_date__lte=apt_date, end_date__gte=apt_date).exists():
                return Response({
                    'success': False,
                    'message': 'Selected stylist is on leave on this date.'
                }, status=status.HTTP_400_BAD_REQUEST)

            existing = Appointment.objects.select_for_update().filter(
                staff=staff,
                appointment_date=apt_date,
                status__in=[Appointment.Status.PENDING, Appointment.Status.CONFIRMED]
            )

            for ex in existing:
                if max(start_t, ex.start_time) < min(end_t, ex.end_time):
                    return Response({
                        'success': False,
                        'message': 'Selected time slot has just been booked by another customer. Please choose another slot.'
                    }, status=status.HTTP_409_CONFLICT)

            appointment = Appointment.objects.create(
                customer=request.user,
                salon=salon,
                service=service,
                staff=staff,
                appointment_date=apt_date,
                start_time=start_t,
                end_time=end_t,
                price=service.price,
                status=Appointment.Status.CONFIRMED,
                notes=serializer.validated_data.get('notes', '')
            )

        # Fail-safe notification: do NOT let this break the booking
        try:
            date_str, time_str = format_appointment_datetime(appointment)
            # Notify customer — "Booking Pending" semantics (awaiting salon's attention)
            create_notification(
                user=request.user,
                title='Booking Confirmed',
                message=(
                    f'Your appointment at {salon.name} for {service.name} '
                    f'on {date_str} at {time_str} has been confirmed.'
                ),
                notification_type=NotificationType.BOOKING_CONFIRMED,
                related_appointment=appointment,
                related_salon=salon,
            )
            # Notify salon owner
            create_notification(
                user=salon.owner,
                title='New Appointment',
                message=(
                    f'A customer booked {service.name} on {date_str} at {time_str}.'
                ),
                notification_type=NotificationType.NEW_APPOINTMENT,
                related_appointment=appointment,
                related_salon=salon,
            )
        except Exception:
            pass  # Never let notification failure break the booking

        return Response({
            'success': True,
            'message': 'Appointment booked successfully!',
            'data': AppointmentSerializer(appointment).data
        }, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        appointment = self.get_object()
        user = request.user

        if user.role == 'STAFF':
            # Verify appointment belongs to this staff member
            if appointment.staff.user != user and appointment.staff.email != user.email:
                return Response({
                    'success': False,
                    'message': 'Permission denied. You can only update appointments assigned to you.'
                }, status=status.HTTP_403_FORBIDDEN)

        old_status = appointment.status
        response = super().partial_update(request, *args, **kwargs)

        # Fail-safe: detect status change and send appropriate notifications
        try:
            appointment.refresh_from_db()
            new_status = appointment.status
            if old_status != new_status:
                date_str, time_str = format_appointment_datetime(appointment)
                salon = appointment.salon
                service = appointment.service
                customer = appointment.customer

                if new_status == Appointment.Status.CONFIRMED:
                    create_notification(
                        user=customer,
                        title='Booking Confirmed',
                        message=(
                            f'Your appointment at {salon.name} for {service.name} '
                            f'on {date_str} at {time_str} has been confirmed.'
                        ),
                        notification_type=NotificationType.BOOKING_CONFIRMED,
                        related_appointment=appointment,
                        related_salon=salon,
                    )
                elif new_status == Appointment.Status.COMPLETED:
                    create_notification(
                        user=customer,
                        title='Appointment Completed',
                        message=(
                            f'Your appointment at {salon.name} for {service.name} '
                            f'on {date_str} at {time_str} has been marked as completed. Thank you!'
                        ),
                        notification_type=NotificationType.BOOKING_COMPLETED,
                        related_appointment=appointment,
                        related_salon=salon,
                    )
                elif new_status == Appointment.Status.CANCELLED:
                    create_notification(
                        user=customer,
                        title='Appointment Cancelled',
                        message=(
                            f'Your appointment at {salon.name} for {service.name} '
                            f'on {date_str} at {time_str} has been cancelled.'
                        ),
                        notification_type=NotificationType.BOOKING_CANCELLED,
                        related_appointment=appointment,
                        related_salon=salon,
                    )
        except Exception:
            pass  # Never let notification failure break the update

        return response

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        user = request.user

        if user != appointment.customer and user.role not in ['SALON_OWNER', 'SALON_MANAGER', 'ADMIN', 'STAFF']:
            return Response({
                'success': False,
                'message': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)

        if user.role == 'STAFF' and appointment.staff.user != user and appointment.staff.email != user.email:
            return Response({
                'success': False,
                'message': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)

        if appointment.status == Appointment.Status.CANCELLED:
            return Response({
                'success': False,
                'message': 'Appointment is already cancelled'
            }, status=status.HTTP_400_BAD_REQUEST)

        appointment.status = Appointment.Status.CANCELLED
        appointment.save()

        # Fail-safe notifications on cancellation
        try:
            date_str, time_str = format_appointment_datetime(appointment)
            salon = appointment.salon
            service = appointment.service
            customer = appointment.customer

            if user == customer:
                # Customer cancelled -> notify salon owner
                create_notification(
                    user=salon.owner,
                    title='Appointment Cancelled',
                    message=(
                        f'Customer {customer.full_name} cancelled appointment for {service.name} '
                        f'on {date_str} at {time_str}.'
                    ),
                    notification_type=NotificationType.APPOINTMENT_CANCELLED_BY_CUSTOMER,
                    related_appointment=appointment,
                    related_salon=salon,
                )
                # Also notify customer confirmation of cancellation
                create_notification(
                    user=customer,
                    title='Booking Cancelled',
                    message=(
                        f'Your appointment at {salon.name} for {service.name} '
                        f'on {date_str} at {time_str} has been cancelled.'
                    ),
                    notification_type=NotificationType.BOOKING_CANCELLED,
                    related_appointment=appointment,
                    related_salon=salon,
                )
            else:
                # Salon owner / staff / admin cancelled -> notify customer
                create_notification(
                    user=customer,
                    title='Appointment Cancelled',
                    message=(
                        f'Your appointment at {salon.name} for {service.name} '
                        f'on {date_str} at {time_str} has been cancelled by the salon.'
                    ),
                    notification_type=NotificationType.BOOKING_CANCELLED,
                    related_appointment=appointment,
                    related_salon=salon,
                )
        except Exception:
            pass  # Never let notification failure break cancellation

        return Response({
            'success': True,
            'message': 'Appointment cancelled successfully',
            'data': AppointmentSerializer(appointment).data
        })
