from django.utils import timezone
from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    time_ago = serializers.SerializerMethodField()
    related_appointment_id = serializers.IntegerField(read_only=True)
    related_salon_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id',
            'title',
            'message',
            'notification_type',
            'is_read',
            'related_appointment_id',
            'related_salon_id',
            'time_ago',
            'created_at',
        ]
        read_only_fields = fields

    def get_time_ago(self, obj):
        now = timezone.now()
        diff = now - obj.created_at
        seconds = int(diff.total_seconds())
        if seconds < 60:
            return 'Just now'
        minutes = seconds // 60
        if minutes < 60:
            return f'{minutes} minute{"s" if minutes > 1 else ""} ago'
        hours = minutes // 60
        if hours < 24:
            return f'{hours} hour{"s" if hours > 1 else ""} ago'
        days = hours // 24
        if days < 7:
            return f'{days} day{"s" if days > 1 else ""} ago'
        return obj.created_at.strftime('%d %b %Y')
