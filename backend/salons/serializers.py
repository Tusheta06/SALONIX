from rest_framework import serializers
from .models import Category, Salon, SalonImage, Service, Staff, WorkingHour, StaffLeave

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'is_active', 'created_at', 'updated_at']


class SalonImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalonImage
        fields = ['id', 'image', 'alt_text', 'created_at']


class WorkingHourSerializer(serializers.ModelSerializer):
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)

    class Meta:
        model = WorkingHour
        fields = ['id', 'salon', 'day_of_week', 'day_name', 'is_open', 'opening_time', 'closing_time']
        read_only_fields = ['salon']


class StaffLeaveSerializer(serializers.ModelSerializer):
    staff = serializers.PrimaryKeyRelatedField(queryset=Staff.objects.all(), required=False)
    staff_name = serializers.CharField(source='staff.name', read_only=True)

    class Meta:
        model = StaffLeave
        fields = ['id', 'staff', 'staff_name', 'start_date', 'end_date', 'reason', 'created_at', 'updated_at']


class StaffSerializer(serializers.ModelSerializer):
    leaves = StaffLeaveSerializer(many=True, read_only=True)
    salon_name = serializers.CharField(source='salon.name', read_only=True)

    class Meta:
        model = Staff
        fields = ['id', 'salon', 'salon_name', 'user', 'name', 'profile_image', 'specialization', 'experience_years', 'phone', 'email', 'is_active', 'leaves', 'created_at', 'updated_at']
        read_only_fields = ['salon']


class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'salon', 'category', 'category_name', 'name', 'description', 'price', 'duration_minutes', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['salon']


class SalonListSerializer(serializers.ModelSerializer):
    images = SalonImageSerializer(many=True, read_only=True)
    starting_price = serializers.SerializerMethodField()

    class Meta:
        model = Salon
        fields = ['id', 'owner', 'name', 'slug', 'description', 'address', 'city', 'state', 'postal_code', 'phone', 'email', 'latitude', 'longitude', 'rating', 'is_active', 'is_approved', 'images', 'starting_price', 'created_at']

    def get_starting_price(self, obj):
        services = obj.services.filter(is_active=True)
        if services.exists():
            return float(min(s.price for s in services))
        return 0.0


class SalonDetailSerializer(serializers.ModelSerializer):
    images = SalonImageSerializer(many=True, read_only=True)
    services = ServiceSerializer(many=True, read_only=True)
    staff = StaffSerializer(many=True, read_only=True)
    working_hours = WorkingHourSerializer(many=True, read_only=True)

    class Meta:
        model = Salon
        fields = [
            'id', 'owner', 'name', 'slug', 'description', 'address', 'city', 'state',
            'postal_code', 'phone', 'email', 'latitude', 'longitude', 'rating',
            'is_active', 'is_approved', 'images', 'services', 'staff', 'working_hours',
            'created_at', 'updated_at'
        ]
