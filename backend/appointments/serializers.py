from rest_framework import serializers
from salons.serializers import SalonListSerializer, ServiceSerializer, StaffSerializer
from accounts.serializers import UserDetailSerializer
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    customer = UserDetailSerializer(read_only=True)
    salon = SalonListSerializer(read_only=True)
    service = ServiceSerializer(read_only=True)
    staff = StaffSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'customer', 'salon', 'service', 'staff',
            'appointment_date', 'start_time', 'end_time', 'price',
            'status', 'notes', 'created_at', 'updated_at'
        ]


class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'id', 'salon', 'service', 'staff',
            'appointment_date', 'start_time', 'notes'
        ]
