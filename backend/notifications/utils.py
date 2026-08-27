"""
Utility helpers for creating notifications.

Usage:
    from notifications.utils import create_notification, notify_admins
    from notifications.models import NotificationType

    # Single user
    create_notification(
        user=appointment.customer,
        title="Booking Confirmed",
        message=f"Your appointment at {salon.name} on {date} at {time} has been confirmed.",
        notification_type=NotificationType.BOOKING_CONFIRMED,
        related_appointment=appointment,
    )

    # All admins
    notify_admins(
        title="New Salon Submitted",
        message=f"{salon.name} submitted for approval.",
        notification_type=NotificationType.SALON_SUBMITTED,
        related_salon=salon,
    )
"""

import logging
from .models import Notification, NotificationType

logger = logging.getLogger(__name__)


def create_notification(user, title, message, notification_type=NotificationType.INFO,
                        related_appointment=None, related_salon=None):
    """Create a single notification for a user. Silently swallows errors to avoid
    breaking the main request flow."""
    try:
        Notification.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type=notification_type,
            related_appointment=related_appointment,
            related_salon=related_salon,
        )
    except Exception as e:
        logger.error(f"Failed to create notification for {user}: {e}")


def notify_admins(title, message, notification_type=NotificationType.INFO,
                  related_appointment=None, related_salon=None):
    """Create the same notification for every admin user."""
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        admins = User.objects.filter(role='ADMIN')
        notifications = [
            Notification(
                user=admin,
                title=title,
                message=message,
                notification_type=notification_type,
                related_appointment=related_appointment,
                related_salon=related_salon,
            )
            for admin in admins
        ]
        if notifications:
            Notification.objects.bulk_create(notifications)
    except Exception as e:
        logger.error(f"Failed to notify admins: {e}")


def format_appointment_datetime(appointment):
    """Return a human-readable date+time string for an appointment."""
    date_str = appointment.appointment_date.strftime('%d %b %Y')
    time_str = appointment.start_time.strftime('%I:%M %p').lstrip('0')
    return date_str, time_str
