from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import CustomerProfile, SalonOwnerProfile

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['role'] = user.role
        token['full_name'] = user.full_name
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'phone': self.user.phone,
            'role': self.user.role,
        }
        return {
            'success': True,
            'message': 'Login successful',
            'data': data
        }


class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ['id', 'profile_image', 'date_of_birth', 'created_at', 'updated_at']


class SalonOwnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalonOwnerProfile
        fields = ['id', 'created_at', 'updated_at']


class UserDetailSerializer(serializers.ModelSerializer):
    customer_profile = CustomerProfileSerializer(read_only=True)
    owner_profile = SalonOwnerProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone', 'role', 'customer_profile', 'owner_profile', 'created_at', 'updated_at']
        read_only_fields = ['id', 'email', 'role', 'created_at', 'updated_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'first_name', 'last_name', 'phone', 'role']

    def validate_role(self, value):
        allowed_roles = [User.Role.CUSTOMER, User.Role.SALON_OWNER]
        if value not in allowed_roles:
            raise serializers.ValidationError('Can only register as CUSTOMER or SALON_OWNER.')
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        role = validated_data.get('role', User.Role.CUSTOMER)
        user = User.objects.create_user(password=password, **validated_data)
        
        if role == User.Role.CUSTOMER:
            CustomerProfile.objects.create(user=user)
        elif role == User.Role.SALON_OWNER:
            SalonOwnerProfile.objects.create(user=user)

        return user
