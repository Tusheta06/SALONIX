# SALONIX — SALON & BEAUTY BOOKING PLATFORM

## 1. PROJECT OVERVIEW

Build a complete, production-quality MVP of a Salon & Beauty Booking Platform called **Salonix**.

### Product Name

Salonix

### Tagline

**"Your next beauty appointment is just a few clicks away."**

### Main Objective

Create ONE complete platform where:

* Customers discover salons and book appointments.
* Salon owners/managers manage their salons.
* Platform administrators manage the entire platform.
* Customers can use the platform through both Web and Mobile.
* The Web and Mobile applications use the SAME Django REST API.
* A public marketing website promotes the Salonix product.

The project should look like a real startup product rather than a basic college project.

---

# 2. IMPORTANT ARCHITECTURE DECISION

This is ONE PRODUCT and ONE PLATFORM.

Do NOT create separate unrelated applications for:

* Customer
* Salon
* Admin
* Marketing

Instead, create ONE React web application with role-based routes.

The React web application should contain:

```text
/                    → Public Marketing Website

/login               → Login
/register            → Customer Registration

/salons              → Customer Salon Discovery
/salons/:id          → Salon Details
/booking             → Customer Booking
/my-bookings         → Customer Bookings
/profile              → Customer Profile

/salon/dashboard     → Salon Dashboard
/salon/profile       → Salon Profile
/salon/services      → Salon Services
/salon/staff         → Salon Staff
/salon/hours         → Working Hours
/salon/leaves        → Staff Leave
/salon/appointments  → Salon Appointments

/admin/dashboard     → Admin Dashboard
/admin/customers     → Customer Management
/admin/salons        → Salon Management
/admin/owners        → Owner Management
/admin/staff         → Staff Management
/admin/services      → Service Management
/admin/categories    → Category Management
/admin/appointments  → Appointment Management
/admin/reviews       → Review Management
```

The mobile application is a separate React Native client because it is a mobile application, but it MUST use the SAME backend API.

---

# 3. FINAL SYSTEM ARCHITECTURE

```text
                         SALONIX
                            |
              ┌─────────────┴─────────────┐
              |                           |
       React Web Application       React Native Mobile
              |                           |
              └─────────────┬─────────────┘
                            |
                       REST API
                            |
                   Django REST Framework
                            |
                      PostgreSQL
```

Web application contains:

```text
Marketing Website
Customer Application
Salon Dashboard
Admin Dashboard
```

Mobile contains:

```text
Customer Mobile Application
```

---

# 4. TECHNOLOGY STACK

## Backend

Use:

* Python
* Django
* Django REST Framework
* PostgreSQL
* Simple JWT
* django-cors-headers
* drf-spectacular
* Pillow
* python-dotenv

## Web

Use:

* React
* Vite
* JavaScript
* React Router
* Axios
* Tailwind CSS

## Mobile

Use:

* React Native
* Expo
* JavaScript
* React Navigation
* Axios

## Version Control

Use:

* Git
* GitHub

---

# 5. DEPLOYMENT ARCHITECTURE

The final deployment should be:

```text
React Web
    ↓
Vercel

Django REST API
    ↓
Render

PostgreSQL
    ↓
Neon or Render PostgreSQL

React Native
    ↓
Expo / EAS
```

The customer/interviewer should primarily receive the Vercel URL.

Example:

```text
https://salonix.vercel.app
```

The backend URL should be used internally by the frontend.

Example:

```text
https://salonix-api.onrender.com
```

API documentation may be available at:

```text
https://salonix-api.onrender.com/api/docs/
```

Do not create separate Vercel deployments for customer, salon, admin, and marketing.

They must be part of the SAME React web application.

---

# 6. REPOSITORY STRUCTURE

Create:

```text
salonix/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── config/
│   ├── accounts/
│   ├── salons/
│   ├── services/
│   ├── appointments/
│   ├── reviews/
│   └── common/
│
├── web/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── assets/
│   │   └── routes/
│   ├── package.json
│   └── vite.config.js
│
├── mobile/
│   ├── screens/
│   ├── components/
│   ├── navigation/
│   ├── services/
│   ├── hooks/
│   ├── context/
│   └── package.json
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATABASE_DESIGN.md
│   └── API_DOCUMENTATION.md
│
├── BUILD_PLAN.md
├── README.md
└── .gitignore
```

Keep code modular and reusable.

Do not create unnecessarily large files.

---

# 7. BRANDING

Create a professional brand called:

## Salonix

Tagline:

**Your next beauty appointment is just a few clicks away.**

Brand personality:

* Premium
* Modern
* Elegant
* Friendly
* Trustworthy
* Simple

Create:

* Logo
* Favicon
* Color palette
* Typography
* Buttons
* Cards
* Forms
* Icons
* Navigation
* Footer

Use a premium salon/beauty visual style.

Avoid excessive gradients and unnecessary animations.

Use high-quality royalty-free/placeholder salon imagery where appropriate.

---

# 8. USER ROLES

Create these roles:

```text
CUSTOMER
SALON_OWNER
SALON_MANAGER
STAFF
ADMIN
```

Permissions must be enforced on the backend.

Do NOT rely only on frontend route protection.

---

# 9. DATABASE MODELS

Create a normalized PostgreSQL database.

Main models:

```text
User
CustomerProfile
SalonOwnerProfile
Salon
SalonImage
Category
Service
Staff
WorkingHour
StaffLeave
Appointment
Review
```

---

# 10. USER MODEL

Use Django authentication appropriately.

Fields should include:

```text
id
email
first_name
last_name
phone
role
is_active
created_at
updated_at
```

Use secure password hashing.

Never store plaintext passwords.

---

# 11. CUSTOMER PROFILE

Fields:

```text
id
user
profile_image
date_of_birth
created_at
updated_at
```

---

# 12. SALON OWNER PROFILE

Fields:

```text
id
user
created_at
updated_at
```

---

# 13. SALON MODEL

Fields:

```text
id
owner
name
slug
description
address
city
state
postal_code
phone
email
latitude
longitude
rating
is_active
is_approved
created_at
updated_at
```

Add database indexes to fields used for searching/filtering.

---

# 14. SALON IMAGE

Fields:

```text
id
salon
image
alt_text
created_at
```

---

# 15. CATEGORY

Fields:

```text
id
name
description
is_active
created_at
updated_at
```

Seed categories such as:

```text
Hair
Haircut
Hair Coloring
Facial
Makeup
Spa
Nails
Bridal
Skin Care
```

---

# 16. SERVICE

Fields:

```text
id
salon
category
name
description
price
duration_minutes
is_active
created_at
updated_at
```

Example:

```text
Haircut
Price: ₹500
Duration: 30 minutes
```

---

# 17. STAFF

Fields:

```text
id
salon
user
name
profile_image
specialization
experience_years
phone
email
is_active
created_at
updated_at
```

---

# 18. WORKING HOURS

Fields:

```text
id
salon
day_of_week
is_open
opening_time
closing_time
```

Support:

```text
Monday
Tuesday
Wednesday
Thursday
Friday
Saturday
Sunday
```

---

# 19. STAFF LEAVE

Fields:

```text
id
staff
start_date
end_date
reason
created_at
updated_at
```

Staff must not be bookable during leave.

---

# 20. APPOINTMENT

Fields:

```text
id
customer
salon
service
staff
appointment_date
start_time
end_time
price
status
notes
created_at
updated_at
```

Statuses:

```text
PENDING
CONFIRMED
COMPLETED
CANCELLED
```

---

# 21. REVIEW

Fields:

```text
id
customer
salon
appointment
rating
comment
created_at
updated_at
```

Rating must be between 1 and 5.

Only customers with completed appointments can review.

---

# 22. DATABASE RELATIONSHIPS

```text
User
 ├── CustomerProfile
 ├── SalonOwnerProfile
 └── Staff

Salon
 ├── SalonImage
 ├── Category/Services
 ├── Staff
 ├── WorkingHours
 ├── Appointments
 └── Reviews

Appointment
 ├── Customer
 ├── Salon
 ├── Service
 └── Staff

Staff
 ├── StaffLeave
 └── Appointments
```

Use appropriate ForeignKey, OneToOneField, and related relationships.

---

# 23. AUTHENTICATION

Implement JWT authentication.

Required endpoints:

```text
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/token/refresh/
GET /api/auth/me/
```

Implement:

* Registration
* Login
* Refresh token
* Logout
* Current user
* Protected routes
* Token expiration handling

---

# 24. ROLE PERMISSIONS

## CUSTOMER

Can:

* Browse salons
* Search salons
* View services
* View staff
* View availability
* Book appointments
* View own appointments
* Cancel own appointments
* Review completed appointments

## SALON_OWNER

Can:

* Manage own salon
* Manage own services
* Manage own staff
* Manage working hours
* Manage staff leave
* Manage appointments

## SALON_MANAGER

Can:

* Manage salon operations
* Manage services
* Manage staff
* Manage working hours
* Manage leave
* Manage appointments

## STAFF

Can:

* View own appointments
* Update permitted appointment status

## ADMIN

Can manage the entire platform.

---

# 25. REST API

Create clean REST APIs.

## Authentication

```text
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/token/refresh/
GET /api/auth/me/
```

## Salons

```text
GET /api/salons/
GET /api/salons/{id}/
POST /api/salons/
PATCH /api/salons/{id}/
DELETE /api/salons/{id}/
```

## Services

```text
GET /api/services/
GET /api/services/{id}/
POST /api/services/
PATCH /api/services/{id}/
DELETE /api/services/{id}/
```

## Staff

```text
GET /api/staff/
GET /api/staff/{id}/
POST /api/staff/
PATCH /api/staff/{id}/
DELETE /api/staff/{id}/
```

## Availability

```text
GET /api/availability/
```

Parameters:

```text
salon_id
service_id
staff_id
date
```

## Appointments

```text
GET /api/appointments/
POST /api/appointments/
GET /api/appointments/{id}/
PATCH /api/appointments/{id}/
POST /api/appointments/{id}/cancel/
```

## Reviews

```text
GET /api/reviews/
POST /api/reviews/
PATCH /api/reviews/{id}/
DELETE /api/reviews/{id}/
```

---

# 26. API RESPONSE FORMAT

Use consistent JSON responses.

Success:

```json
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Selected time slot is unavailable",
  "errors": {}
}
```

Use appropriate HTTP status codes.

---

# 27. AVAILABILITY ENGINE

This is a critical feature.

The backend must calculate available slots dynamically.

Availability must consider:

1. Salon working hours
2. Staff availability
3. Staff leave
4. Existing appointments
5. Service duration
6. Appointment date
7. Current time
8. Overlapping appointments

Example:

Working hours:

```text
09:00 - 18:00
```

Service duration:

```text
60 minutes
```

Existing appointment:

```text
11:00 - 12:00
```

Available:

```text
09:00
10:00
12:00
13:00
14:00
15:00
16:00
17:00
```

11:00 must not be available.

Do not hardcode availability in React.

---

# 28. DOUBLE BOOKING PREVENTION

The backend MUST prevent double bookings.

Never rely only on frontend validation.

Before creating an appointment:

```text
1. Validate authentication.
2. Validate customer.
3. Validate salon.
4. Validate service.
5. Validate staff.
6. Validate appointment date.
7. Validate working hours.
8. Validate staff leave.
9. Calculate end time.
10. Check overlapping appointments.
11. Use database transaction.
12. Create appointment.
```

If two users attempt to book the same slot, only one should succeed.

Return an appropriate conflict/error response for the second request.

---

# 29. CUSTOMER WEB APPLICATION

Create ONE React application.

Customer routes:

```text
/login
/register
/
/salons
/salons/:id
/booking
/booking/confirmation
/my-bookings
/my-bookings/:id
/profile
```

---

# 30. CUSTOMER HOME PAGE

Include:

Hero:

**Find your perfect salon.**

Search:

```text
Location
Salon
Service
```

Sections:

* Featured salons
* Popular services
* Top-rated salons
* How it works
* Testimonials
* CTA

---

# 31. SALON DISCOVERY

Implement:

* Search
* Filtering
* Sorting
* Pagination

Filters:

```text
Location
Category
Rating
Price range
Service
```

Salon card:

```text
Image
Salon name
Rating
Location
Popular service
Starting price
View Salon
```

---

# 32. SALON DETAILS

Show:

* Salon images
* Salon name
* Description
* Rating
* Reviews
* Address
* Phone
* Opening hours
* Services
* Pricing
* Duration
* Staff
* Reviews

Primary CTA:

**Book Appointment**

---

# 33. CUSTOMER BOOKING FLOW

Implement:

```text
Select Salon
      ↓
Select Service
      ↓
Select Stylist
      ↓
Select Date
      ↓
View Available Time Slots
      ↓
Select Time
      ↓
Review Booking
      ↓
Confirm Booking
```

Use a clear step indicator.

Do not allow invalid progression.

---

# 34. BOOKING CONFIRMATION

Display:

```text
Salon
Service
Stylist
Date
Time
Duration
Price
```

Button:

**Confirm Booking**

After successful booking, display confirmation.

---

# 35. BOOKING HISTORY

Tabs:

```text
Upcoming
Completed
Cancelled
```

Display:

```text
Salon
Service
Stylist
Date
Time
Price
Status
```

Allow cancellation when permitted.

---

# 36. SALON DASHBOARD

Routes:

```text
/salon/dashboard
/salon/profile
/salon/services
/salon/staff
/salon/hours
/salon/leaves
/salon/appointments
```

Dashboard statistics:

```text
Today's appointments
Upcoming appointments
Revenue
Active staff
Services
Pending appointments
```

---

# 37. SALON PROFILE MANAGEMENT

Allow:

* Edit salon name
* Description
* Address
* Phone
* Email
* Images
* Category

---

# 38. SERVICE MANAGEMENT

Implement CRUD:

```text
Create
Read
Update
Delete
Activate
Deactivate
```

Fields:

```text
Name
Category
Description
Price
Duration
Status
```

Use confirmation before deletion.

---

# 39. STAFF MANAGEMENT

Implement:

```text
Add staff
Edit staff
Deactivate staff
View staff
```

Fields:

```text
Name
Email
Phone
Specialization
Experience
Image
Status
```

---

# 40. WORKING HOURS

Allow salon managers to configure:

```text
Monday
Tuesday
Wednesday
Thursday
Friday
Saturday
Sunday
```

Each day:

```text
Open/Closed
Opening Time
Closing Time
```

---

# 41. STAFF LEAVE

Allow:

* Add leave
* Edit leave
* Delete leave
* View upcoming leave

The availability engine must automatically respect staff leave.

---

# 42. SALON APPOINTMENTS

Display:

```text
Customer
Service
Stylist
Date
Time
Price
Status
```

Filters:

```text
Date
Staff
Service
Status
```

Actions:

```text
Confirm
Complete
Cancel
```

---

# 43. ADMIN DASHBOARD

Routes:

```text
/admin/dashboard
/admin/customers
/admin/salons
/admin/owners
/admin/staff
/admin/categories
/admin/services
/admin/appointments
/admin/reviews
```

---

# 44. ADMIN STATISTICS

Show:

```text
Total Customers
Total Salons
Total Salon Owners
Total Staff
Total Appointments
Completed Appointments
Cancelled Appointments
Revenue
```

Charts:

```text
Monthly Appointments
Revenue Trend
Popular Services
Salon Growth
```

---

# 45. ADMIN MANAGEMENT

## Customers

Admin can:

* Search
* View
* Activate
* Deactivate

## Salons

Admin can:

* View
* Approve
* Suspend
* Activate

## Owners

Admin can:

* View
* Activate
* Deactivate

## Staff

Admin can:

* View
* Search
* View details

## Categories

Admin can:

* Create
* Edit
* Delete

## Services

Admin can:

* View
* Manage

## Appointments

Admin can:

* View
* Search
* Filter

## Reviews

Admin can:

* View
* Remove inappropriate reviews

---

# 46. MOBILE APPLICATION

Create a React Native + Expo application.

The mobile application is ONLY for customers.

It must use the same Django API as the React web application.

Screens:

```text
Splash
Login
Register
Home
Search
Salon Details
Service Selection
Stylist Selection
Date Selection
Time Selection
Booking Confirmation
My Bookings
Booking Details
Profile
```

Main flow:

```text
Login
 ↓
Discover Salon
 ↓
Select Service
 ↓
Select Stylist
 ↓
Select Date
 ↓
Select Time
 ↓
Book
 ↓
Manage Booking
```

Do not create a separate backend for mobile.

---

# 47. MOBILE UI

Use:

* Bottom navigation
* Mobile-first layout
* Large touch targets
* Cards
* Clean typography
* Loading states
* Error states
* Empty states
* Confirmation dialogs

The mobile booking experience should feel polished.

---

# 48. MARKETING WEBSITE

The marketing website is part of the SAME React web application.

Routes:

```text
/
/about
/how-it-works
/for-salons
/contact
```

Homepage sections:

```text
Navigation
Hero
Salon Search CTA
Featured Salons
Popular Services
How It Works
Customer Benefits
Salon Owner Benefits
Testimonials
Mobile App Section
FAQ
CTA
Footer
```

---

# 49. SEO

Implement:

* Page titles
* Meta descriptions
* Semantic HTML
* Correct H1/H2 hierarchy
* Image alt text
* Open Graph metadata
* SEO-friendly URLs
* robots.txt
* sitemap where practical

---

# 50. UI DESIGN SYSTEM

Create reusable components:

```text
Button
Input
Select
Modal
Card
Badge
Avatar
Dropdown
Table
Pagination
Tabs
Toast
Loader
Skeleton
EmptyState
ErrorState
DatePicker
TimeSlot
Navbar
Footer
```

Avoid duplicate components.

---

# 51. RESPONSIVE DESIGN

The web application must work on:

```text
Mobile
Tablet
Laptop
Desktop
```

Ensure:

* No horizontal scrolling
* Responsive navigation
* Responsive tables
* Responsive cards
* Responsive forms
* Responsive dashboards

---

# 52. ERROR HANDLING

Backend must handle:

* Validation errors
* Authentication errors
* Permission errors
* Not found
* Conflict
* Server errors

Frontend must handle:

* API errors
* Network errors
* Loading
* Empty data
* Failed requests
* Invalid forms
* Unauthorized access

Use user-friendly error messages.

---

# 53. SECURITY

Implement:

* JWT authentication
* Password hashing
* Backend RBAC
* Object-level authorization
* Input validation
* CORS
* Environment variables
* Secure production settings

Never expose:

```text
Passwords
SECRET_KEY
Database credentials
API keys
Tokens
```

Create:

```text
.env.example
```

Never commit `.env`.

---

# 54. DEMO DATA

Create a Django management command to seed demo data.

Create:

```text
5 salons
Multiple categories
Multiple services
10+ stylists
Multiple customers
Working hours
Staff leave
Appointments
Reviews
```

Demo accounts:

```text
Admin:
admin@salonix.demo

Salon Owner:
owner@salonix.demo

Customer:
customer@salonix.demo

Staff:
stylist@salonix.demo
```

Use one documented demo password.

---

# 55. API DOCUMENTATION

Use drf-spectacular or equivalent.

Create Swagger/OpenAPI documentation.

Document:

* Authentication
* Salons
* Services
* Staff
* Availability
* Appointments
* Reviews
* Admin APIs

Expose:

```text
/api/docs/
```

---

# 56. TESTING

Create backend tests for:

```text
Registration
Login
JWT
Role permissions
Salon CRUD
Service CRUD
Staff CRUD
Working hours
Staff leave
Availability
Appointment creation
Double booking
Overlapping appointment
Cancellation
Reviews
```

Test the main frontend flow:

```text
Login
→ Discover
→ Salon
→ Service
→ Stylist
→ Date
→ Time
→ Booking
```

Test mobile booking flow as well.

---

# 57. ENVIRONMENT VARIABLES

Backend:

```text
SECRET_KEY=
DEBUG=
DATABASE_URL=
ALLOWED_HOSTS=
CORS_ALLOWED_ORIGINS=
```

Web:

```text
VITE_API_URL=
```

Mobile:

```text
EXPO_PUBLIC_API_URL=
```

Never hardcode production secrets.

---

# 58. DOCUMENTATION

Create:

## README.md

Include:

```text
Project Overview
Features
Architecture
Technology Stack
Folder Structure
Database Design
Authentication
API Documentation
Installation
Environment Variables
Running Backend
Running Web
Running Mobile
Demo Credentials
Testing
Deployment
Technical Decisions
Future Improvements
```

Create:

```text
docs/ARCHITECTURE.md
docs/DATABASE_DESIGN.md
docs/API_DOCUMENTATION.md
```

---

# 59. DEVELOPMENT PHASES

## PHASE 1 — INITIAL SETUP

Tasks:

* Inspect workspace
* Create repository structure
* Initialize Django
* Initialize React/Vite
* Initialize Expo
* Configure Git
* Configure environment variables
* Configure PostgreSQL
* Create documentation files

At the end of Phase 1:

* Backend starts successfully.
* React starts successfully.
* Mobile starts successfully.
* Database connection is configured.

---

# PHASE 2 — DATABASE

Implement:

* User
* CustomerProfile
* SalonOwnerProfile
* Salon
* SalonImage
* Category
* Service
* Staff
* WorkingHour
* StaffLeave
* Appointment
* Review

Run migrations.

Create seed data.

Test relationships.

---

# PHASE 3 — AUTHENTICATION

Implement:

* Registration
* Login
* JWT
* Refresh token
* Current user
* Role-based permissions
* Protected routes

Test every role.

---

# PHASE 4 — CORE APIs

Implement:

* Salon APIs
* Category APIs
* Service APIs
* Staff APIs
* Working hour APIs
* Leave APIs

Add filtering/search/pagination where useful.

---

# PHASE 5 — AVAILABILITY

Implement the complete availability engine.

Test:

* Working hours
* Closed days
* Staff leave
* Existing appointments
* Service duration
* Past dates
* Overlapping appointments

---

# PHASE 6 — APPOINTMENTS

Implement:

* Create
* Read
* Update
* Cancel
* Confirm
* Complete

Implement double-booking prevention.

Use transactions.

---

# PHASE 7 — REVIEWS

Implement:

* Create
* Read
* Update
* Delete
* Average rating
* Review count

Only completed appointments can be reviewed.

---

# PHASE 8 — CUSTOMER WEB

Build:

* Marketing homepage
* Login
* Register
* Salon discovery
* Search
* Filters
* Salon details
* Service selection
* Stylist selection
* Date selection
* Time slots
* Booking confirmation
* Booking history
* Cancellation
* Profile

Connect EVERYTHING to the real API.

Do not use fake data for the main flow.

---

# PHASE 9 — SALON DASHBOARD

Build:

* Dashboard
* Salon profile
* Services
* Staff
* Working hours
* Staff leave
* Appointments

Use the same API.

---

# PHASE 10 — ADMIN DASHBOARD

Build:

* Statistics
* Customers
* Salons
* Owners
* Staff
* Categories
* Services
* Appointments
* Reviews

Use backend permissions.

---

# PHASE 11 — MOBILE

Build:

* Authentication
* Home
* Discovery
* Salon details
* Services
* Staff
* Date
* Time
* Booking
* Booking history
* Cancellation

Use the SAME API.

---

# PHASE 12 — UI/UX POLISH

Improve:

* Typography
* Spacing
* Cards
* Buttons
* Forms
* Loading
* Skeletons
* Empty states
* Error states
* Animations
* Responsive behavior
* Accessibility

---

# PHASE 13 — TESTING

Run:

* Backend tests
* API tests
* Frontend testing
* Mobile testing
* Permission testing
* Booking tests
* Double booking tests
* Responsive testing

Fix all critical issues.

---

# PHASE 14 — DEPLOYMENT

Deploy:

## Backend

Deploy Django API to Render.

## Database

Use PostgreSQL.

## Web

Deploy the ONE React application to Vercel.

## Mobile

Create Expo/EAS Android build.

Configure production API URL.

---

# PHASE 15 — FINAL DOCUMENTATION

Update:

```text
README.md
ARCHITECTURE.md
DATABASE_DESIGN.md
API_DOCUMENTATION.md
```

Include:

* Live URL
* API URL
* Swagger URL
* Demo credentials
* Setup instructions
* Deployment instructions

---

# 60. PRIORITY LEVELS

## P0 — MUST WORK

These features are mandatory:

```text
Authentication
RBAC
Salon discovery
Salon details
Services
Staff
Availability
Booking
Double booking prevention
Booking history
Cancellation
Salon dashboard
Admin dashboard
Same API for web/mobile
```

## P1 — IMPORTANT

```text
Reviews
Search
Filters
Analytics
Staff leave
Working hours
Swagger
Seed data
Responsive design
```

## P2 — POLISH

```text
Animations
Advanced analytics
Extra filters
Additional marketing content
Advanced notifications
```

If time becomes limited, complete P0 before P1/P2.

---

# 61. FINAL CUSTOMER FLOW

The final web application must support:

```text
Open Salonix
 ↓
Discover Salon
 ↓
Open Salon
 ↓
Select Service
 ↓
Select Stylist
 ↓
Select Date
 ↓
View Real Available Slots
 ↓
Select Time
 ↓
Confirm Booking
 ↓
View Booking
 ↓
Cancel Booking
```

---

# 62. FINAL SALON OWNER FLOW

```text
Login
 ↓
Salon Dashboard
 ↓
Manage Salon
 ↓
Manage Services
 ↓
Manage Staff
 ↓
Configure Working Hours
 ↓
Add Staff Leave
 ↓
View Appointments
 ↓
Update Appointment Status
```

---

# 63. FINAL ADMIN FLOW

```text
Login
 ↓
Admin Dashboard
 ↓
View Statistics
 ↓
Manage Customers
 ↓
Manage Salons
 ↓
Manage Owners
 ↓
Manage Staff
 ↓
Manage Categories
 ↓
Manage Services
 ↓
Manage Appointments
 ↓
Manage Reviews
```

---

# 64. FINAL MOBILE FLOW

```text
Login
 ↓
Discover Salon
 ↓
Select Salon
 ↓
Select Service
 ↓
Select Stylist
 ↓
Select Date
 ↓
Select Time
 ↓
Book
 ↓
View Booking
 ↓
Manage Booking
```

---

# 65. FINAL ACCEPTANCE CRITERIA

The project is complete only when:

* Backend runs successfully.
* Database works.
* Authentication works.
* RBAC works.
* Customer booking works.
* Availability is dynamic.
* Double booking is prevented.
* Staff leave is respected.
* Salon dashboard works.
* Admin dashboard works.
* Mobile application uses the same API.
* Marketing website works.
* Web application is responsive.
* API documentation works.
* Demo data exists.
* README is complete.
* Production deployment works.

---

# 66. FINAL SUBMISSION

Prepare:

```text
1. GitHub Repository

2. Live Web Application
   https://salonix.vercel.app/

3. Backend API
   https://salonix-api.onrender.com/

4. API Documentation
   https://salonix-api.onrender.com/api/docs/

5. Mobile Application
   Expo/EAS Android build

6. README
   Setup + architecture + deployment + demo credentials

7. Demo Credentials
   Admin
   Salon Owner
   Customer
   Staff
```

---

# 67. DEVELOPMENT RULES FOR ANTIGRAVITY

Treat this BUILD_PLAN.md as the source of truth.

IMPORTANT:

Do not implement the entire project in one step.

Work phase-by-phase.

Before each phase:

1. Inspect existing implementation.
2. Understand dependencies.
3. Implement only the required phase.
4. Run tests.
5. Fix errors.
6. Verify existing functionality.
7. Update documentation.
8. Continue to the next phase.

Do not destroy working code while adding new functionality.

Do not introduce unnecessary dependencies.

Do not use fake data for core functionality.

Do not hardcode availability.

Do not hardcode permissions.

Do not create separate APIs for mobile and web.

Do not create separate React applications for customer, salon, admin, and marketing.

Use ONE React web application with role-based routes.

The mobile application must consume the same REST API.

---

# 68. STARTING INSTRUCTION

When this BUILD_PLAN.md is loaded:

FIRST:

1. Read the entire BUILD_PLAN.md.
2. Analyze the architecture.
3. Inspect the current workspace.
4. Create the project structure.
5. Create a technical implementation plan.
6. Begin PHASE 1.

Do not skip directly to the UI.

Start with architecture and backend foundation.

After completing each phase, test it before moving forward.

The final goal is a polished, demonstrable, real-world Salon & Beauty Booking Platform called Salonix.

END OF BUILD PLAN
