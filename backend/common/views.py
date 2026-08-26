from django.db.models import Sum, Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from common.permissions import IsAdminUser
from accounts.models import User
from salons.models import Salon, Staff, Category, Service
from appointments.models import Appointment
from reviews.models import Review

class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_customers = User.objects.filter(role=User.Role.CUSTOMER).count()
        total_owners = User.objects.filter(role=User.Role.SALON_OWNER).count()
        total_staff = Staff.objects.count()
        total_salons = Salon.objects.count()
        pending_salons = Salon.objects.filter(is_approved=False).count()

        total_appointments = Appointment.objects.count()
        completed_appointments = Appointment.objects.filter(status=Appointment.Status.COMPLETED).count()
        cancelled_appointments = Appointment.objects.filter(status=Appointment.Status.CANCELLED).count()
        confirmed_appointments = Appointment.objects.filter(status=Appointment.Status.CONFIRMED).count()

        total_revenue = Appointment.objects.filter(
            status__in=[Appointment.Status.CONFIRMED, Appointment.Status.COMPLETED]
        ).aggregate(total=Sum('price'))['total'] or 0.0

        total_reviews = Review.objects.count()

        return Response({
            'success': True,
            'message': 'Admin dashboard statistics fetched',
            'data': {
                'total_customers': total_customers,
                'total_owners': total_owners,
                'total_staff': total_staff,
                'total_salons': total_salons,
                'pending_salons': pending_salons,
                'total_appointments': total_appointments,
                'completed_appointments': completed_appointments,
                'cancelled_appointments': cancelled_appointments,
                'confirmed_appointments': confirmed_appointments,
                'total_revenue': float(total_revenue),
                'total_reviews': total_reviews,
            }
        })
