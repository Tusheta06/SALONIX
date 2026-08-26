import datetime
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import User
from salons.models import Category, Salon, Service, Staff, WorkingHour, StaffLeave
from appointments.models import Appointment

class SalonixRoleArchitectureTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.password = 'password123'

        # 1. Create Users for each role
        self.customer = User.objects.create_user(
            email='customer@salonix.demo',
            password=self.password,
            first_name='Priya',
            last_name='Verma',
            role=User.Role.CUSTOMER
        )
        self.owner = User.objects.create_user(
            email='owner@salonix.demo',
            password=self.password,
            first_name='Rajesh',
            last_name='Sharma',
            role=User.Role.SALON_OWNER
        )
        self.stylist = User.objects.create_user(
            email='stylist@salonix.demo',
            password=self.password,
            first_name='Ananya',
            last_name='Roy',
            role=User.Role.STAFF
        )
        self.other_stylist = User.objects.create_user(
            email='other@salonix.demo',
            password=self.password,
            first_name='Karan',
            last_name='Nair',
            role=User.Role.STAFF
        )
        self.admin = User.objects.create_user(
            email='admin@salonix.demo',
            password=self.password,
            first_name='Platform',
            last_name='Admin',
            role=User.Role.ADMIN,
            is_staff=True,
            is_superuser=True
        )

        # 2. Setup Salon, Services, Staff
        self.category = Category.objects.create(name='Haircut')
        self.salon = Salon.objects.create(
            owner=self.owner,
            name='Luxe Salon',
            description='Luxury salon',
            address='123 Hill Road',
            city='Mumbai',
            phone='9876543210',
            email='luxe@salon.com',
            rating=4.8
        )

        for d in range(7):
            WorkingHour.objects.create(
                salon=self.salon,
                day_of_week=d,
                is_open=True,
                opening_time=datetime.time(9, 0),
                closing_time=datetime.time(18, 0)
            )

        self.service = Service.objects.create(
            salon=self.salon,
            category=self.category,
            name='Haircut',
            price=500.00,
            duration_minutes=30
        )

        self.staff_ananya = Staff.objects.create(
            salon=self.salon,
            user=self.stylist,
            name='Ananya Roy',
            email=self.stylist.email,
            specialization='Hair Cut',
            experience_years=5
        )

        self.staff_karan = Staff.objects.create(
            salon=self.salon,
            user=self.other_stylist,
            name='Karan Nair',
            email=self.other_stylist.email,
            specialization='Coloring',
            experience_years=4
        )

        # 3. Create Appointments
        self.today = datetime.date.today()
        self.apt_ananya = Appointment.objects.create(
            customer=self.customer,
            salon=self.salon,
            service=self.service,
            staff=self.staff_ananya,
            appointment_date=self.today,
            start_time=datetime.time(10, 0),
            end_time=datetime.time(10, 30),
            price=500.00,
            status=Appointment.Status.CONFIRMED
        )

        self.apt_karan = Appointment.objects.create(
            customer=self.customer,
            salon=self.salon,
            service=self.service,
            staff=self.staff_karan,
            appointment_date=self.today,
            start_time=datetime.time(11, 0),
            end_time=datetime.time(11, 30),
            price=500.00,
            status=Appointment.Status.CONFIRMED
        )

    def test_customer_login(self):
        res = self.client.post(reverse('auth_login'), {'email': self.customer.email, 'password': self.password})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['data']['user']['role'], 'CUSTOMER')

    def test_staff_login(self):
        res = self.client.post(reverse('auth_login'), {'email': self.stylist.email, 'password': self.password})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['data']['user']['role'], 'STAFF')

    def test_salon_owner_login(self):
        res = self.client.post(reverse('auth_login'), {'email': self.owner.email, 'password': self.password})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['data']['user']['role'], 'SALON_OWNER')

    def test_admin_login(self):
        res = self.client.post(reverse('auth_login'), {'email': self.admin.email, 'password': self.password})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['data']['user']['role'], 'ADMIN')

    def test_staff_assigned_appointments_scoping(self):
        # Authenticate as Ananya (Stylist)
        self.client.force_authenticate(user=self.stylist)
        res = self.client.get(reverse('appointment-list'))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        apt_ids = [apt['id'] for apt in (res.data.get('results') or res.data.get('data'))]
        # Ananya must ONLY see her assigned appointment, NOT Karan's
        self.assertIn(self.apt_ananya.id, apt_ids)
        self.assertNotIn(self.apt_karan.id, apt_ids)

    def test_staff_cannot_create_service(self):
        # Authenticate as Stylist
        self.client.force_authenticate(user=self.stylist)
        res = self.client.post(reverse('service-list'), {
            'salon': self.salon.id,
            'name': 'Unauthorized Service',
            'price': 1000.00,
            'duration_minutes': 60
        })
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_cannot_modify_other_staff_appointments(self):
        self.client.force_authenticate(user=self.stylist)
        # Attempt to cancel Karan's appointment
        url = reverse('appointment-cancel', kwargs={'pk': self.apt_karan.id})
        res = self.client.post(url)
        self.assertIn(res.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND])

    def test_staff_leave_auto_assignment(self):
        self.client.force_authenticate(user=self.stylist)
        res = self.client.post(reverse('staffleave-list'), {
            'start_date': str(self.today),
            'end_date': str(self.today + datetime.timedelta(days=2)),
            'reason': 'Stylist Personal Vacation'
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        # Ensure leave was assigned to Ananya
        self.assertEqual(res.data['staff'], self.staff_ananya.id)

    def test_staff_me_profile_endpoint(self):
        self.client.force_authenticate(user=self.stylist)
        url = reverse('staff-me')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['data']['name'], 'Ananya Roy')
