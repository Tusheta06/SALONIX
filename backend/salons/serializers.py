from rest_framework import serializers
from .models import Category, Salon, SalonImage, Service, Staff, WorkingHour, StaffLeave

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'is_active', 'created_at', 'updated_at']


class SalonImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalonImage
        fields = ['id', 'salon', 'image', 'alt_text', 'created_at']
        extra_kwargs = {'salon': {'required': False}}


class WorkingHourSerializer(serializers.ModelSerializer):
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)

    class Meta:
        model = WorkingHour
        fields = ['id', 'salon', 'day_of_week', 'day_name', 'is_open', 'opening_time', 'closing_time']
        extra_kwargs = {'salon': {'required': False}}


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
        extra_kwargs = {'salon': {'required': False}}

    def validate_experience_years(self, value):
        if value < 0:
            raise serializers.ValidationError('Experience years must be 0 or greater.')
        return value


class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'salon', 'category', 'category_name', 'name', 'description', 'price', 'duration_minutes', 'is_active', 'created_at', 'updated_at']
        extra_kwargs = {'salon': {'required': False}}

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError('Service price must be 0 or greater.')
        return value

    def validate_duration_minutes(self, value):
        if value <= 0:
            raise serializers.ValidationError('Service duration must be greater than 0 minutes.')
        return value


class SalonListSerializer(serializers.ModelSerializer):
    images = SalonImageSerializer(many=True, read_only=True)
    starting_price = serializers.SerializerMethodField()
    services_count = serializers.IntegerField(source='services.count', read_only=True)
    staff_count = serializers.IntegerField(source='staff.count', read_only=True)
    images_count = serializers.IntegerField(source='images.count', read_only=True)

    class Meta:
        model = Salon
        fields = [
            'id', 'owner', 'name', 'slug', 'description', 'address', 'city', 'state',
            'postal_code', 'phone', 'email', 'latitude', 'longitude', 'rating',
            'is_active', 'is_approved', 'approval_status', 'rejection_reason', 'images',
            'starting_price', 'services_count', 'staff_count', 'images_count', 'created_at'
        ]

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
            'is_active', 'is_approved', 'approval_status', 'rejection_reason', 'images',
            'services', 'staff', 'working_hours', 'created_at', 'updated_at'
        ]


class SalonCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salon
        fields = [
            'id', 'name', 'description', 'address', 'city', 'state', 'postal_code',
            'phone', 'email', 'latitude', 'longitude'
        ]

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Salon name is required.')
        return value.strip()

    def validate_description(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Description is required.')
        return value.strip()
