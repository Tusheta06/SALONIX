import datetime
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import User
from salons.models import Category, Salon, SalonImage, Service, Staff, WorkingHour, StaffLeave
from appointments.models import Appointment

class SalonRegistrationAndApprovalWorkflowTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.password = 'password123'

        # 1. Accounts
        self.admin = User.objects.create_user(
            email='admin@salonix.com',
            password=self.password,
            first_name='Platform',
            last_name='Admin',
            role=User.Role.ADMIN,
            is_staff=True,
            is_superuser=True
        )

        self.customer = User.objects.create_user(
            email='customer@test.com',
            password=self.password,
            first_name='Test',
            last_name='Customer',
            role=User.Role.CUSTOMER
        )

        self.owner_tusheta = User.objects.create_user(
            email='tusheta@salonix.com',
            password=self.password,
            first_name='Tusheta',
            last_name='Owner',
            role=User.Role.SALON_OWNER
        )

        self.other_owner = User.objects.create_user(
            email='other_owner@salonix.com',
            password=self.password,
            first_name='Other',
            last_name='Owner',
            role=User.Role.SALON_OWNER
        )

        self.category = Category.objects.create(name='Hair Styling')

    def _get_items(self, response_data):
        if isinstance(response_data, dict):
            if 'results' in response_data:
                return response_data['results']
            if 'data' in response_data:
                return response_data['data']
        if isinstance(response_data, list):
            return response_data
        return []

    def _get_id(self, response_data):
        if isinstance(response_data, dict):
            if 'id' in response_data:
                return response_data['id']
            if 'data' in response_data and isinstance(response_data['data'], dict):
                return response_data['data'].get('id')
        return None

    def test_full_end_to_end_salon_registration_and_admin_approval_workflow(self):
        # TEST 1: Login as tusheta@salonix.com
        res_login = self.client.post(reverse('auth_login'), {'email': 'tusheta@salonix.com', 'password': self.password})
        self.assertEqual(res_login.status_code, status.HTTP_200_OK)
        self.assertEqual(res_login.data['data']['user']['role'], 'SALON_OWNER')

        # TEST 2: Owner sees No Salon Registered
        self.client.force_authenticate(user=self.owner_tusheta)
        res_my_salon = self.client.get(reverse('salon-my-salon'))
        self.assertEqual(res_my_salon.status_code, status.HTTP_404_NOT_FOUND)

        # TEST 3: Owner creates salon with details
        res_create_salon = self.client.post(reverse('salon-list'), {
            'name': 'Tusheta Royal Salon',
            'description': 'Luxury salon setup',
            'address': '45 Park Avenue',
            'city': 'Mumbai',
            'state': 'Maharashtra',
            'postal_code': '400001',
            'phone': '9876543210',
            'email': 'royal@salon.com'
        })
        self.assertEqual(res_create_salon.status_code, status.HTTP_201_CREATED)
        salon_id = self._get_id(res_create_salon.data)

        # Add 2 services
        srv1 = self.client.post(reverse('service-list'), {
            'salon': salon_id,
            'category': self.category.id,
            'name': 'Royal Hair Cut',
            'description': 'Precision haircut',
            'price': 600.00,
            'duration_minutes': 45,
            'is_active': True
        })
        self.assertEqual(srv1.status_code, status.HTTP_201_CREATED)
        srv1_id = self._get_id(srv1.data)

        srv2 = self.client.post(reverse('service-list'), {
            'salon': salon_id,
            'category': self.category.id,
            'name': 'Hair Spa',
            'description': 'Deep conditioning',
            'price': 1200.00,
            'duration_minutes': 60
        })
        self.assertEqual(srv2.status_code, status.HTTP_201_CREATED)

        # Add 2 staff members
        st1 = self.client.post(reverse('staff-list'), {
            'salon': salon_id,
            'name': 'Priya Stylist',
            'specialization': 'Hair Cut Specialist',
            'experience_years': 4,
            'phone': '9876543211',
            'email': 'priya@royal.com'
        })
        self.assertEqual(st1.status_code, status.HTTP_201_CREATED)

        st2 = self.client.post(reverse('staff-list'), {
            'salon': salon_id,
            'name': 'Karan Hair Expert',
            'specialization': 'Colorist',
            'experience_years': 5,
            'phone': '9876543212',
            'email': 'karan@royal.com'
        })
        self.assertEqual(st2.status_code, status.HTTP_201_CREATED)

        # Configure working hours
        for d in range(7):
            self.client.post(reverse('workinghour-list'), {
                'salon': salon_id,
                'day_of_week': d,
                'is_open': True,
                'opening_time': '09:00:00',
                'closing_time': '18:00:00'
            })

        # TEST 4: Salon status is PENDING & is_approved is False
        salon_obj = Salon.objects.get(pk=salon_id)
        self.assertEqual(salon_obj.approval_status, Salon.ApprovalStatus.PENDING)
        self.assertFalse(salon_obj.is_approved)

        # TEST 5: Customer API does NOT show the pending salon
        self.client.force_authenticate(user=self.customer)
        res_cust_salons = self.client.get(reverse('salon-list'))
        self.assertEqual(res_cust_salons.status_code, status.HTTP_200_OK)
        public_items = self._get_items(res_cust_salons.data)
        public_ids = [s['id'] for s in public_items]
        self.assertNotIn(salon_id, public_ids)

        # TEST 6: Admin sees the pending salon
        self.client.force_authenticate(user=self.admin)
        res_admin_salons = self.client.get(reverse('salon-list') + '?approval_status=PENDING')
        self.assertEqual(res_admin_salons.status_code, status.HTTP_200_OK)
        pending_items = self._get_items(res_admin_salons.data)
        pending_ids = [s['id'] for s in pending_items]
        self.assertIn(salon_id, pending_ids)

        # TEST 7: Admin inspects salon details
        res_admin_detail = self.client.get(reverse('salon-detail', kwargs={'pk': salon_id}))
        self.assertEqual(res_admin_detail.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_admin_detail.data['services']), 2)
        self.assertEqual(len(res_admin_detail.data['staff']), 2)

        # TEST 8: Admin approves salon
        res_approve = self.client.post(reverse('salon-approve', kwargs={'pk': salon_id}))
        self.assertEqual(res_approve.status_code, status.HTTP_200_OK)

        # TEST 9: Salon becomes APPROVED
        salon_obj.refresh_from_db()
        self.assertEqual(salon_obj.approval_status, Salon.ApprovalStatus.APPROVED)
        self.assertTrue(salon_obj.is_approved)

        # TEST 10: Customer API now shows the approved salon
        self.client.force_authenticate(user=self.customer)
        res_cust_salons_after = self.client.get(reverse('salon-list'))
        public_items_after = self._get_items(res_cust_salons_after.data)
        public_ids_after = [s['id'] for s in public_items_after]
        self.assertIn(salon_id, public_ids_after)

        # TEST 11: Owner can edit their own Salon, Services, Staff
        self.client.force_authenticate(user=self.owner_tusheta)
        res_edit_srv = self.client.patch(reverse('service-detail', kwargs={'pk': srv1_id}), {'price': 650.00})
        self.assertEqual(res_edit_srv.status_code, status.HTTP_200_OK)

        # TEST 12: Other Salon Owner CANNOT modify Tusheta's service/staff
        self.client.force_authenticate(user=self.other_owner)
        res_unauthorized_edit = self.client.patch(reverse('service-detail', kwargs={'pk': srv1_id}), {'price': 1.00})
        self.assertEqual(res_unauthorized_edit.status_code, status.HTTP_403_FORBIDDEN)
