from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from salons.models import Salon, Service, Staff, WorkingHour, Category
from appointments.models import Appointment
from notifications.models import Notification, NotificationType
from datetime import date, time, timedelta

User = get_user_model()


class NotificationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Users
        self.customer = User.objects.create_user(
            email='customer@example.com',
            password='password123',
            first_name='Jane',
            last_name='Doe',
            role=User.Role.CUSTOMER
        )
        self.other_customer = User.objects.create_user(
            email='other@example.com',
            password='password123',
            first_name='John',
            last_name='Smith',
            role=User.Role.CUSTOMER
        )
        self.owner = User.objects.create_user(
            email='owner@example.com',
            password='password123',
            first_name='Salon',
            last_name='Owner',
            role=User.Role.SALON_OWNER
        )
        self.admin = User.objects.create_user(
            email='admin@example.com',
            password='password123',
            first_name='Admin',
            last_name='User',
            role=User.Role.ADMIN
        )

        # Salon setup
        self.category = Category.objects.create(name='Hair Care')
        self.salon = Salon.objects.create(
            owner=self.owner,
            name='Glow Salon',
            address='123 Main St',
            city='Mumbai',
            phone='1234567890',
            email='glow@example.com',
            is_approved=True,
            approval_status=Salon.ApprovalStatus.APPROVED
        )
        self.service = Service.objects.create(
            salon=self.salon,
            category=self.category,
            name='Haircut',
            price=500.00,
            duration_minutes=30,
            is_active=True
        )
        self.staff = Staff.objects.create(
            salon=self.salon,
            name='Sarah Stylist',
            specialization='Stylist',
            is_active=True
        )
        for d in range(7):
            WorkingHour.objects.create(
                salon=self.salon,
                day_of_week=d,
                opening_time=time(9, 0),
                closing_time=time(20, 0),
                is_open=True
            )

    def test_notification_user_isolation(self):
        """User A should only see User A's notifications."""
        Notification.objects.create(
            user=self.customer,
            title='Customer Notice',
            message='For customer only',
            notification_type=NotificationType.INFO
        )
        Notification.objects.create(
            user=self.other_customer,
            title='Other Notice',
            message='For other only',
            notification_type=NotificationType.INFO
        )

        self.client.force_authenticate(user=self.customer)
        response = self.client.get('/api/notifications/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Handle paginated or unpaginated response
        data = response.data.get('results', response.data.get('data', response.data))
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['title'], 'Customer Notice')

    def test_unread_count_and_mark_read(self):
        """Test unread count and marking a notification as read."""
        n1 = Notification.objects.create(
            user=self.customer,
            title='Note 1',
            message='Unread 1',
            is_read=False
        )
        n2 = Notification.objects.create(
            user=self.customer,
            title='Note 2',
            message='Unread 2',
            is_read=False
        )

        self.client.force_authenticate(user=self.customer)
        count_res = self.client.get('/api/notifications/unread_count/')
        self.assertEqual(count_res.data['count'], 2)

        # Mark n1 as read
        mark_res = self.client.post(f'/api/notifications/{n1.id}/mark_read/')
        self.assertEqual(mark_res.status_code, status.HTTP_200_OK)
        self.assertTrue(mark_res.data['data']['is_read'])

        count_res2 = self.client.get('/api/notifications/unread_count/')
        self.assertEqual(count_res2.data['count'], 1)

    def test_mark_all_read(self):
        """Test marking all notifications as read."""
        Notification.objects.create(user=self.customer, title='1', message='m', is_read=False)
        Notification.objects.create(user=self.customer, title='2', message='m', is_read=False)

        self.client.force_authenticate(user=self.customer)
        res = self.client.post('/api/notifications/mark_all_read/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['count'], 2)

        unread = Notification.objects.filter(user=self.customer, is_read=False).count()
        self.assertEqual(unread, 0)

    def test_delete_notification(self):
        """Test deleting a notification."""
        n = Notification.objects.create(user=self.customer, title='1', message='m')
        self.client.force_authenticate(user=self.customer)
        res = self.client.delete(f'/api/notifications/{n.id}/delete/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertFalse(Notification.objects.filter(id=n.id).exists())

    def test_booking_creates_notifications(self):
        """Booking an appointment creates notifications for customer and salon owner."""
        self.client.force_authenticate(user=self.customer)
        booking_date = (date.today() + timedelta(days=1)).isoformat()
        payload = {
            'salon': self.salon.id,
            'service': self.service.id,
            'staff': self.staff.id,
            'appointment_date': booking_date,
            'start_time': '10:00:00',
            'notes': 'Looking forward to it'
        }
        res = self.client.post('/api/appointments/', payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # Customer should have a notification
        cust_notifs = Notification.objects.filter(user=self.customer)
        self.assertTrue(cust_notifs.exists())
        self.assertIn('Glow Salon', cust_notifs.first().message)

        # Owner should have a notification
        owner_notifs = Notification.objects.filter(user=self.owner)
        self.assertTrue(owner_notifs.exists())
        self.assertEqual(owner_notifs.first().notification_type, NotificationType.NEW_APPOINTMENT)

    def test_salon_approval_notifications(self):
        """Admin approving/rejecting salon notifies the owner."""
        unapproved_salon = Salon.objects.create(
            owner=self.owner,
            name='New Salon',
            address='456 Ave',
            city='Delhi',
            phone='9999999999',
            email='new@salon.com',
            is_approved=False,
            approval_status=Salon.ApprovalStatus.PENDING
        )
        self.client.force_authenticate(user=self.admin)
        res = self.client.post(f'/api/salons/{unapproved_salon.id}/approve/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        owner_notifs = Notification.objects.filter(
            user=self.owner,
            notification_type=NotificationType.SALON_APPROVED
        )
        self.assertTrue(owner_notifs.exists())
        self.assertIn('approved', owner_notifs.first().title.lower())
