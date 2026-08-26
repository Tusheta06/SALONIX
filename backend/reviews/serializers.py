from rest_framework import serializers
from accounts.serializers import UserDetailSerializer
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    customer = UserDetailSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'customer', 'salon', 'appointment', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['id', 'customer', 'created_at', 'updated_at']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value

    def validate(self, attrs):
        appointment = attrs.get('appointment')
        if appointment and appointment.status != 'COMPLETED':
            raise serializers.ValidationError({'appointment': 'Reviews can only be submitted for COMPLETED appointments.'})
        return attrs
