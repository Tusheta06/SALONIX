# SALONIX — DATABASE DESIGN & SCHEMA

## Overview

The Salonix backend uses a normalized relational PostgreSQL/SQLite schema managed through Django ORM migrations.

---

## Entity Relationship Summary

```text
User (1) ────< CustomerProfile (1)
User (1) ────< SalonOwnerProfile (1)
User (1) ────< Salon [as Owner] (N)

Salon (1) ───< SalonImage (N)
Salon (1) ───< Service (N)
Salon (1) ───< Staff (N)
Salon (1) ───< WorkingHour (N)
Salon (1) ───< Appointment (N)

Staff (1) ───< StaffLeave (N)
Staff (1) ───< Appointment (N)

Category (1) ─< Service (N)

Appointment (1) ───< Review (1)
```

---

## Core Models

### 1. User
- `id`: BigAutoField (Primary Key)
- `email`: EmailField (Unique, Username Field)
- `first_name`, `last_name`: CharField
- `phone`: CharField
- `role`: Enum (`CUSTOMER`, `SALON_OWNER`, `SALON_MANAGER`, `STAFF`, `ADMIN`)
- `created_at`, `updated_at`: DateTimeField

### 2. Salon
- `id`: BigAutoField
- `owner_id`: ForeignKey(User)
- `name`, `slug`: CharField/SlugField
- `address`, `city`, `state`, `postal_code`: CharField (Indexed on `city`)
- `phone`, `email`: CharField/EmailField
- `rating`: DecimalField (Indexed)
- `is_active`, `is_approved`: BooleanField (Indexed)

### 3. Service
- `id`: BigAutoField
- `salon_id`: ForeignKey(Salon)
- `category_id`: ForeignKey(Category)
- `name`, `description`: CharField/TextField
- `price`: DecimalField
- `duration_minutes`: IntegerField

### 4. Staff
- `id`: BigAutoField
- `salon_id`: ForeignKey(Salon)
- `user_id`: OneToOneField(User, Nullable)
- `name`, `specialization`, `experience_years`: CharField/IntegerField

### 5. WorkingHour
- `id`: BigAutoField
- `salon_id`: ForeignKey(Salon)
- `day_of_week`: IntegerField (0 = Monday .. 6 = Sunday)
- `is_open`: BooleanField
- `opening_time`, `closing_time`: TimeField

### 6. StaffLeave
- `id`: BigAutoField
- `staff_id`: ForeignKey(Staff)
- `start_date`, `end_date`: DateField

### 7. Appointment
- `id`: BigAutoField
- `customer_id`: ForeignKey(User)
- `salon_id`: ForeignKey(Salon)
- `service_id`: ForeignKey(Service)
- `staff_id`: ForeignKey(Staff)
- `appointment_date`: DateField
- `start_time`, `end_time`: TimeField
- `price`: DecimalField
- `status`: Enum (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`)

### 8. Review
- `id`: BigAutoField
- `customer_id`: ForeignKey(User)
- `salon_id`: ForeignKey(Salon)
- `appointment_id`: OneToOneField(Appointment)
- `rating`: IntegerField (1 to 5)
- `comment`: TextField
