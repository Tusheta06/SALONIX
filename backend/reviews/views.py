from django.db.models import Avg
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from salons.models import Salon
from .models import Review
from .serializers import ReviewSerializer
from notifications.utils import create_notification
from notifications.models import NotificationType

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Review.objects.all()
        salon_id = self.request.query_params.get('salon_id')
        if salon_id:
            qs = qs.filter(salon_id=salon_id)
        return qs

    def perform_create(self, serializer):
        review = serializer.save(customer=self.request.user)
        self.update_salon_rating(review.salon)

        # Fail-safe notifications
        try:
            salon = review.salon
            customer = self.request.user
            # Notify customer
            create_notification(
                user=customer,
                title='Review Submitted',
                message=f'Thank you for submitting a {review.rating}-star review for {salon.name}.',
                notification_type=NotificationType.REVIEW_SUBMITTED,
                related_salon=salon,
                related_appointment=review.appointment,
            )
            # Notify salon owner
            create_notification(
                user=salon.owner,
                title='New Review',
                message=f'{customer.full_name} left a {review.rating}-star review for {salon.name}.',
                notification_type=NotificationType.NEW_REVIEW,
                related_salon=salon,
                related_appointment=review.appointment,
            )
        except Exception:
            pass

    def perform_update(self, serializer):
        review = serializer.save()
        self.update_salon_rating(review.salon)

    def perform_destroy(self, instance):
        salon = instance.salon
        super().perform_destroy(instance)
        self.update_salon_rating(salon)

    def update_salon_rating(self, salon):
        avg_rating = Review.objects.filter(salon=salon).aggregate(Avg('rating'))['rating__avg']
        if avg_rating is not None:
            salon.rating = round(avg_rating, 2)
            salon.save()
