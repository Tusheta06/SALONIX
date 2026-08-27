from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class NotificationType(models.TextChoices):
    # Appointment-related
    BOOKING_CONFIRMED = 'BOOKING_CONFIRMED', _('Booking Confirmed')
    BOOKING_CANCELLED = 'BOOKING_CANCELLED', _('Booking Cancelled')
    BOOKING_COMPLETED = 'BOOKING_COMPLETED', _('Booking Completed')
    BOOKING_PENDING   = 'BOOKING_PENDING',   _('Booking Pending')
    # Salon owner receives these
    NEW_APPOINTMENT   = 'NEW_APPOINTMENT',   _('New Appointment')
    APPOINTMENT_CANCELLED_BY_CUSTOMER = 'APPOINTMENT_CANCELLED_BY_CUSTOMER', _('Appointment Cancelled by Customer')
    # Review
    REVIEW_SUBMITTED  = 'REVIEW_SUBMITTED',  _('Review Submitted')
    NEW_REVIEW        = 'NEW_REVIEW',        _('New Review')
    # Salon approval
    SALON_APPROVED    = 'SALON_APPROVED',    _('Salon Approved')
    SALON_REJECTED    = 'SALON_REJECTED',    _('Salon Rejected')
    SALON_SUBMITTED   = 'SALON_SUBMITTED',   _('New Salon Submitted')
    # Registration
    NEW_OWNER_REGISTERED = 'NEW_OWNER_REGISTERED', _('New Salon Owner Registered')
    # Generic
    INFO              = 'INFO',              _('Info')


class Notification(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        db_index=True,
    )
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=50,
        choices=NotificationType.choices,
        default=NotificationType.INFO,
        db_index=True,
    )
    is_read = models.BooleanField(default=False, db_index=True)

    # Optional foreign keys to related objects for navigation
    related_appointment = models.ForeignKey(
        'appointments.Appointment',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='notifications',
    )
    related_salon = models.ForeignKey(
        'salons.Salon',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='notifications',
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        status = 'unread' if not self.is_read else 'read'
        return f"[{status}] {self.title} → {self.user.email}"
