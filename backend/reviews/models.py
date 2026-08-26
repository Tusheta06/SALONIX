from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from salons.models import Salon
from appointments.models import Appointment

class Review(models.Model):
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='customer_reviews'
    )
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='reviews')
    appointment = models.OneToOneField(
        Appointment,
        on_delete=models.CASCADE,
        related_name='review'
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Review ({self.rating}★) by {self.customer.email} for {self.salon.name}"
