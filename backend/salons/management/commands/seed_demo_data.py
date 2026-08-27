import datetime
from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import User, CustomerProfile, SalonOwnerProfile
from salons.models import Category, Salon, SalonImage, Service, Staff, WorkingHour, StaffLeave
from appointments.models import Appointment
from reviews.models import Review

class Command(BaseCommand):
    help = 'Seeds initial demo data for Salonix platform'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting demo data seeding...'))

        demo_password = 'password123'

        # 1. Create Core Users
        # Admins
        for admin_email in ['admin@salonix.com', 'admin@salonix.demo']:
            u, _ = User.objects.get_or_create(
                email=admin_email,
                defaults={
                    'first_name': 'Platform',
                    'last_name': 'Admin',
                    'phone': '+91 9876543210',
                    'role': User.Role.ADMIN,
                    'is_staff': True,
                    'is_superuser': True
                }
            )
            u.set_password(demo_password)
            u.save()

        # Customers
        for cust_email in ['customer@test.com', 'customer@salonix.demo']:
            u, _ = User.objects.get_or_create(
                email=cust_email,
                defaults={
                    'first_name': 'Priya',
                    'last_name': 'Verma',
                    'phone': '+91 9876543212',
                    'role': User.Role.CUSTOMER
                }
            )
            u.set_password(demo_password)
            u.save()
            CustomerProfile.objects.get_or_create(user=u)

        # Salon Owner with NO salon (tusheta@salonix.com for testing new salon creation workflow)
        owner_tusheta, _ = User.objects.get_or_create(
            email='tusheta@salonix.com',
            defaults={
                'first_name': 'Tusheta',
                'last_name': 'Owner',
                'phone': '+91 9876500000',
                'role': User.Role.SALON_OWNER
            }
        )
        owner_tusheta.set_password(demo_password)
        owner_tusheta.save()
        SalonOwnerProfile.objects.get_or_create(user=owner_tusheta)

        # Salon Owner with existing demo salon (owner@salonix.demo)
        owner_user, _ = User.objects.get_or_create(
            email='owner@salonix.demo',
            defaults={
                'first_name': 'Rajesh',
                'last_name': 'Sharma',
                'phone': '+91 9876543211',
                'role': User.Role.SALON_OWNER
            }
        )
        owner_user.set_password(demo_password)
        owner_user.save()
        SalonOwnerProfile.objects.get_or_create(user=owner_user)

        # Staff user
        stylist_user, _ = User.objects.get_or_create(
            email='stylist@salonix.demo',
            defaults={
                'first_name': 'Ananya',
                'last_name': 'Roy',
                'phone': '+91 9876543214',
                'role': User.Role.STAFF
            }
        )
        stylist_user.set_password(demo_password)
        stylist_user.save()

        self.stdout.write('Created core demo users.')

        # 2. Create Categories
        categories_data = [
            ('Haircut & Styling', 'Precision haircuts, blowouts, and signature styling.'),
            ('Hair Coloring', 'Global coloring, balayage, highlights, and root touch-ups.'),
            ('Facial & Skincare', 'Deep cleansing facials, anti-aging therapies, and radiance treatments.'),
            ('Makeup', 'Bridal makeup, party makeup, HD makeover services.'),
            ('Spa & Massage', 'Relaxing head massages, body polishes, and aromatherapy.'),
            ('Nails & Pedicure', 'Gel manicures, acrylic art, spa pedicures.'),
            ('Bridal Packages', 'Comprehensive luxury bridal makeover and styling packages.'),
        ]

        categories_dict = {}
        for cat_name, cat_desc in categories_data:
            cat_obj, _ = Category.objects.get_or_create(
                name=cat_name,
                defaults={'description': cat_desc, 'is_active': True}
            )
            categories_dict[cat_name] = cat_obj

        self.stdout.write('Created categories.')

        # 3. Create Demo Approved Salons for owner@salonix.demo
        salons_info = [
            {
                'name': 'Luxe & Glow Beauty Lounge',
                'description': 'Premium beauty salon specializing in hair transformations, luxury facials, and couture makeup in Bandra West.',
                'address': '402 Hill Road, Bandra West',
                'city': 'Mumbai',
                'state': 'Maharashtra',
                'postal_code': '400050',
                'phone': '+91 9820011223',
                'email': 'contact@luxeglow.com',
                'rating': 4.85,
                'services': [
                    ('Royal Haircut & Style', 'Haircut & Styling', 800.00, 45),
                    ('Organic Gold Glow Facial', 'Facial & Skincare', 2500.00, 60),
                    ('Signature Balayage Color', 'Hair Coloring', 4500.00, 120),
                    ('Gel Manicure & Nail Art', 'Nails & Pedicure', 1200.00, 45)
                ],
                'staff': [
                    ('Ananya Roy', 'Hair Specialist & Senior Stylist', 6, stylist_user),
                    ('Vikram Sen', 'Color Specialist', 8, None),
                    ('Meera Kapoor', 'Skin & Facial Expert', 5, None)
                ]
            },
            {
                'name': 'The Urban Cut Barbershop',
                'description': 'Modern male grooming and hair styling studio with beard styling, hair spa, and executive haircuts.',
                'address': '12 100ft Road, Indiranagar',
                'city': 'Bengaluru',
                'state': 'Karnataka',
                'postal_code': '560038',
                'phone': '+91 9845099887',
                'email': 'indiranagar@urbancut.com',
                'rating': 4.70,
                'services': [
                    ('Executive Gentleman Haircut', 'Haircut & Styling', 550.00, 30),
                    ('Beard Grooming & Hot Towel Spa', 'Haircut & Styling', 350.00, 25),
                    ('Scalp Therapy Hair Spa', 'Spa & Massage', 999.00, 45)
                ],
                'staff': [
                    ('Rohan Mehta', 'Beard & Fade Master', 7, None),
                    ('Karan Nair', 'Senior Barber', 4, None)
                ]
            }
        ]

        created_salons = []
        created_services = []
        created_staff = []

        for info in salons_info:
            salon_obj, _ = Salon.objects.get_or_create(
                name=info['name'],
                defaults={
                    'owner': owner_user,
                    'description': info['description'],
                    'address': info['address'],
                    'city': info['city'],
                    'state': info['state'],
                    'postal_code': info['postal_code'],
                    'phone': info['phone'],
                    'email': info['email'],
                    'rating': info['rating'],
                    'is_active': True,
                    'is_approved': True,
                    'approval_status': Salon.ApprovalStatus.APPROVED
                }
            )
            created_salons.append(salon_obj)

            for day in range(7):
                is_open = True
                open_t = '09:00:00' if day < 6 else '10:00:00'
                close_t = '19:00:00' if day < 6 else '17:00:00'
                WorkingHour.objects.get_or_create(
                    salon=salon_obj,
                    day_of_week=day,
                    defaults={'is_open': is_open, 'opening_time': open_t, 'closing_time': close_t}
                )

            for s_name, cat_name, price, duration in info['services']:
                cat = categories_dict.get(cat_name)
                srv, _ = Service.objects.get_or_create(
                    salon=salon_obj,
                    name=s_name,
                    defaults={
                        'category': cat,
                        'price': price,
                        'duration_minutes': duration,
                        'is_active': True,
                        'description': f'Premium {s_name} service at {salon_obj.name}'
                    }
                )
                created_services.append(srv)

            for st_name, spec, exp, user_obj in info['staff']:
                st_member, _ = Staff.objects.get_or_create(
                    salon=salon_obj,
                    name=st_name,
                    defaults={
                        'user': user_obj,
                        'specialization': spec,
                        'experience_years': exp,
                        'phone': info['phone'],
                        'email': f"{st_name.lower().replace(' ', '.')}@{salon_obj.slug}.com",
                        'is_active': True
                    }
                )
                created_staff.append(st_member)

        self.stdout.write(self.style.SUCCESS('Successfully seeded demo data!'))
