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

        # 1. Create Users
        demo_password = 'password123'

        admin_user, _ = User.objects.get_or_create(
            email='admin@salonix.demo',
            defaults={
                'first_name': 'Platform',
                'last_name': 'Admin',
                'phone': '+91 9876543210',
                'role': User.Role.ADMIN,
                'is_staff': True,
                'is_superuser': True
            }
        )
        admin_user.set_password(demo_password)
        admin_user.save()

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

        customer_user, _ = User.objects.get_or_create(
            email='customer@salonix.demo',
            defaults={
                'first_name': 'Priya',
                'last_name': 'Verma',
                'phone': '+91 9876543212',
                'role': User.Role.CUSTOMER
            }
        )
        customer_user.set_password(demo_password)
        customer_user.save()
        CustomerProfile.objects.get_or_create(user=customer_user)

        customer2, _ = User.objects.get_or_create(
            email='customer2@salonix.demo',
            defaults={
                'first_name': 'Aarav',
                'last_name': 'Patel',
                'phone': '+91 9876543213',
                'role': User.Role.CUSTOMER
            }
        )
        customer2.set_password(demo_password)
        customer2.save()
        CustomerProfile.objects.get_or_create(user=customer2)

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

        # 3. Create Salons & Details
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
            },
            {
                'name': 'Serene Spa & Wellness Hub',
                'description': 'Tranquil sanctuary for body massage, ayurvedic therapies, aromatherapy, and facial rejuvenation.',
                'address': '88 Greater Kailash 1',
                'city': 'Delhi',
                'state': 'Delhi',
                'postal_code': '110048',
                'phone': '+91 9811044556',
                'email': 'hello@serenespa.in',
                'rating': 4.90,
                'services': [
                    ('Aromatherapy Full Body Spa', 'Spa & Massage', 3200.00, 90),
                    ('Deep Tissue De-Stress Spa', 'Spa & Massage', 3800.00, 90),
                    ('Hydra-Peel Radiance Facial', 'Facial & Skincare', 2800.00, 60)
                ],
                'staff': [
                    ('Suma Sharma', 'Aromatherapist', 9, None),
                    ('Ritu Gupta', 'Facial Specialist', 6, None)
                ]
            },
            {
                'name': 'Glamour Edge Hair Studio',
                'description': 'Contemporary hair salon renowned for creative cuts, KERATIN smoothing, and fashion hair colors.',
                'address': '55 Jubilee Hills Rd 36',
                'city': 'Hyderabad',
                'state': 'Telangana',
                'postal_code': '500033',
                'phone': '+91 9885033445',
                'email': 'jubilee@glamouredge.com',
                'rating': 4.65,
                'services': [
                    ('Keratin Hair Smoothing Therapy', 'Hair Coloring', 6500.00, 150),
                    ('Precision Layer Cut', 'Haircut & Styling', 900.00, 45),
                    ('Party Glam Makeup', 'Makeup', 3000.00, 60)
                ],
                'staff': [
                    ('David Fernandez', 'Creative Art Director', 12, None),
                    ('Sneha Reddy', 'Senior Hair Stylist', 5, None)
                ]
            },
            {
                'name': 'Velvet Touch Nail & Skin Care',
                'description': 'Boutique beauty salon offering pampering manicure, pedicure, skin whitening, and party makeup.',
                'address': '10 Koregaon Park Main Rd',
                'city': 'Pune',
                'state': 'Maharashtra',
                'postal_code': '411001',
                'phone': '+91 9822077665',
                'email': 'info@velvettouch.com',
                'rating': 4.80,
                'services': [
                    ('Luxury Rose Spa Pedicure', 'Nails & Pedicure', 950.00, 45),
                    ('Acrylic Nail Extensions', 'Nails & Pedicure', 2200.00, 75),
                    ('Bridal Glow Facial & Cleanup', 'Bridal Packages', 4000.00, 90)
                ],
                'staff': [
                    ('Pooja Joshi', 'Nail Artist & Esthetician', 6, None),
                    ('Tanya Singhania', 'Makeup & Skin Expert', 8, None)
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
                    'is_approved': True
                }
            )
            created_salons.append(salon_obj)

            # Create working hours (Mon-Sat 09:00-19:00, Sun 10:00-17:00)
            for day in range(7):
                is_open = True
                open_t = '09:00:00' if day < 6 else '10:00:00'
                close_t = '19:00:00' if day < 6 else '17:00:00'
                WorkingHour.objects.get_or_create(
                    salon=salon_obj,
                    day_of_week=day,
                    defaults={'is_open': is_open, 'opening_time': open_t, 'closing_time': close_t}
                )

            # Create services
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

            # Create staff
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

        self.stdout.write(f'Created {len(created_salons)} salons, services, and staff.')

        # 4. Create Staff Leave
        first_staff = created_staff[0]
        today = timezone.now().date()
        StaffLeave.objects.get_or_create(
            staff=first_staff,
            start_date=today + datetime.timedelta(days=10),
            end_date=today + datetime.timedelta(days=12),
            defaults={'reason': 'Annual Vacation'}
        )

        # 5. Create Sample Appointments & Reviews
        main_salon = created_salons[0]
        main_service = main_salon.services.first()
        main_staff = main_salon.staff.first()

        # Completed Appointment with Review
        past_date = today - datetime.timedelta(days=3)
        apt_completed, _ = Appointment.objects.get_or_create(
            customer=customer_user,
            salon=main_salon,
            service=main_service,
            staff=main_staff,
            appointment_date=past_date,
            start_time=datetime.time(11, 0),
            defaults={
                'end_time': datetime.time(11, 45),
                'price': main_service.price,
                'status': Appointment.Status.COMPLETED,
                'notes': 'Customer requested extra hair shine treatment.'
            }
        )

        Review.objects.get_or_create(
            appointment=apt_completed,
            defaults={
                'customer': customer_user,
                'salon': main_salon,
                'rating': 5,
                'comment': 'Awesome experience! Ananya did a fantastic haircut and blowout.'
            }
        )

        # Confirmed Upcoming Appointment
        future_date = today + datetime.timedelta(days=2)
        Appointment.objects.get_or_create(
            customer=customer_user,
            salon=main_salon,
            service=main_service,
            staff=main_staff,
            appointment_date=future_date,
            start_time=datetime.time(14, 0),
            defaults={
                'end_time': datetime.time(14, 45),
                'price': main_service.price,
                'status': Appointment.Status.CONFIRMED,
                'notes': 'Please hold the slot.'
            }
        )

        # Pending Appointment for second customer
        Appointment.objects.get_or_create(
            customer=customer2,
            salon=created_salons[1],
            service=created_salons[1].services.first(),
            staff=created_salons[1].staff.first(),
            appointment_date=future_date,
            start_time=datetime.time(10, 0),
            defaults={
                'end_time': datetime.time(10, 30),
                'price': created_salons[1].services.first().price,
                'status': Appointment.Status.PENDING,
                'notes': 'First time visit.'
            }
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded all demo data for Salonix!'))
