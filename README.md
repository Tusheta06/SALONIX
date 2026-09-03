# SALONIX — SALON & BEAUTY BOOKING PLATFORM

> **"Your next beauty appointment is just a few clicks away."**

Salonix is a full-stack, multi-role **Salon & Beauty Booking Platform** built to connect customers with salons, stylists, and real-time appointment scheduling.

The platform provides a complete customer booking experience across **Web and Mobile**, along with dedicated **Salon Owner/Manager** and **Platform Admin** dashboards.

---

## 🌐 Live Applications

### Customer Web Application

**Live Web App:**
https://salonix-30wbdb30x-tusheta06s-projects.vercel.app/

### Production Backend API

**Render API:**
https://salonix.onrender.com/api/

### API Documentation

**Swagger / OpenAPI Documentation:**
https://salonix.onrender.com/api/docs/

---

# 🌟 Key Features

## 👤 Customer Web Application

* User registration and login
* JWT authentication
* Search and discover salons
* View salon details
* Browse services and pricing
* Select staff/stylist
* Select appointment date
* Check real-time availability
* Select available time slots
* Book appointments
* View booking history
* Cancel appointments
* Submit reviews and ratings
* One booking per customer per day validation
* Prevention of overlapping and double bookings

## 📱 Customer Mobile Application

The mobile application implements the main customer booking flow:

**Login → Discover Salon → Select Service → Select Stylist → Select Date/Time → Book → Manage Booking**

* React Native + Expo
* Uses the same Django REST API as the web application
* Salon discovery
* Service selection
* Stylist selection
* Date/time selection
* Appointment booking
* Booking management

## 💇 Salon Owner / Manager Dashboard

Salon owners/managers can:

* Manage salon details
* Manage services
* Manage service pricing
* Manage service duration
* Manage staff/stylists
* Manage working hours
* Manage staff leave
* View appointments
* Manage appointment status

## 🛡️ Platform Admin Dashboard

Administrators can manage:

* Customers
* Salon owners
* Salons
* Staff
* Services
* Categories
* Appointments
* Reviews and ratings
* Salon approvals/suspensions
* Platform statistics
* User governance

---

# ⚙️ Core Technical Features

### Dynamic Availability Engine

The availability engine calculates appointment slots based on:

* Salon working hours
* Service duration
* Staff availability
* Staff leave schedules
* Existing non-cancelled appointments
* Current date and time
* Appointment conflicts

### Atomic Double-Booking Prevention

Appointment confirmation uses Django database transactions and:

```python
select_for_update()
```

This provides database-level locking during appointment confirmation and helps prevent concurrent double bookings.

### Appointment Validation

The backend validates booking requests to prevent:

* Overlapping appointments
* Invalid time slots
* Booking outside working hours
* Booking during staff leave
* Booking unavailable slots
* Multiple appointments by the same customer on the same day

---

# 🛠️ Technology Stack

## Backend

* Python 3.10+
* Django 4.2+
* Django REST Framework
* SimpleJWT
* PostgreSQL
* SQLite for local development
* Pillow
* drf-spectacular
* Gunicorn

## Web

* React 18
* Vite 6
* React Router 6
* Axios
* Tailwind CSS v3
* Lucide Icons

## Mobile

* React Native
* Expo SDK 51
* React Navigation

## Deployment

* Backend: Render
* Database: PostgreSQL
* Web: Vercel
* Mobile: Expo

## Development Tools

* Git
* GitHub
* VS Code
* Swagger / OpenAPI

---

# 🔑 Demo Accounts

All demo accounts use the standard password:

```text
password123
```

| Role              | Email                   | Capabilities                                                                            |
| ----------------- | ----------------------- | --------------------------------------------------------------------------------------- |
| **Admin**         | `admin@salonix.demo`    | Platform statistics, salon approvals/suspensions, category management, user governance  |
| **Salon Owner**   | `owner@salonix.demo`    | Manage salon profile, services, staff, working hours, staff leave and appointments      |
| **Customer**      | `customer@salonix.demo` | Search salons, select services/stylists, book slots, manage bookings and submit reviews |
| **Staff Stylist** | `stylist@salonix.demo`  | View assigned appointments and update treatment status                                  |

> The web login page also provides a **One-Click Demo Account Filler** for quickly switching between demo roles.

---

# 🚀 Local Development Setup

## Prerequisites

Install the following before running the project:

* Python 3.10+
* Node.js
* npm
* Git

---

# 1. Backend Setup

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd salon
```

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

### Windows

```bash
python -m venv venv
.\venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run database migrations:

```bash
python manage.py migrate
```

Seed demo data:

```bash
python manage.py seed_demo_data
```

The seed command creates demo salons, services, staff, working hours, appointments and reviews.

Start the Django development server:

```bash
python manage.py runserver
```

Backend:

```text
http://localhost:8000/
```

API:

```text
http://localhost:8000/api/
```

Swagger:

```text
http://localhost:8000/api/docs/
```

---

# 2. Web Application Setup

Open a new terminal and navigate to:

```bash
cd web
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The web application will normally be available at:

```text
http://localhost:3000/
```

## Web Environment Configuration

For local development:

```env
VITE_API_URL=http://localhost:8000
```

For production:

```env
VITE_API_URL=https://salonix.onrender.com
```

The frontend uses `VITE_API_URL` to communicate with the Django REST API.

---

# 3. Mobile Application Setup

Salonix includes a React Native customer mobile application built with Expo.

The mobile application uses the **same Django REST API** as the web application.

## 📲 Run Using Expo Go

### Step 1 — Install Expo Go

Install Expo Go on your Android or iOS device:

**Expo Go:**
https://expo.dev/go

### Step 2 — Start the Expo Development Server

From the project root:

```bash
cd mobile
npm install
npx expo start
```

Expo will display a QR code.

### Step 3 — Connect Your Phone

Make sure your phone and development computer are connected to the **same Wi-Fi network**.

Open **Expo Go** on your phone and scan the QR code displayed by Expo.

The Salonix mobile application should then open inside Expo Go.

### Step 4 — Configure the API

For production testing:

```text
https://salonix.onrender.com/api/
```

For local Android emulator development:

```text
http://10.0.2.2:8000/api/
```

`10.0.2.2` allows an Android emulator to access the Django server running on the development computer.

## 📦 Expo Project

**Expo Project / Development URL:**
*Add the actual Expo project URL here if available.*

**Expo QR Code:**
*Use the QR code generated by `npx expo start` for local testing.*

### Mobile Demo Login

```text
Email: customer@salonix.demo
Password: password123
```

### Mobile Booking Flow

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
Select Available Time
  ↓
Book Appointment
  ↓
Manage Booking
```

---

# ☁️ Production Deployment

Salonix uses a shared backend architecture where both the web and mobile applications communicate with the same Django REST API.

```text
                    SALONIX PLATFORM

             ┌──────────────────────┐
             │   Customer Web App   │
             │       Vercel         │
             └──────────┬───────────┘
                        │
                        │ REST API
                        ▼
             ┌──────────────────────┐
             │   Django REST API    │
             │       Render         │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │      PostgreSQL      │
             │       Database       │
             └──────────────────────┘
                        ▲
                        │
                        │ REST API
                        │
             ┌──────────┴───────────┐
             │    Mobile App        │
             │   Expo / React Native│
             └──────────────────────┘
```

---

# 🖥️ Backend Deployment — Render

The Django backend is deployed on Render.

## Production API

```text
https://salonix.onrender.com/api/
```

## Swagger / OpenAPI

```text
https://salonix.onrender.com/api/docs/
```

## Render Environment Variables

Configure the following variables in the Render dashboard:

```env
SECRET_KEY=<your-production-secret-key>
DEBUG=False
DATABASE_URL=<your-postgresql-database-url>
ALLOWED_HOSTS=salonix.onrender.com
```

> **Never commit production secrets, database passwords, or private credentials to GitHub.**

## Build Command

```bash
pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
```

## Start Command

```bash
gunicorn config.wsgi:application
```

The production backend handles:

* Authentication
* Authorization
* Users and roles
* Salons
* Services
* Staff
* Working hours
* Staff leave
* Availability
* Appointments
* Reviews
* Admin functionality

---

# 🌍 Frontend Deployment — Vercel

The React/Vite web application is deployed on Vercel.

## Live Web Application

```text
https://salonix-30wbdb30x-tusheta06s-projects.vercel.app/
```

## Vercel Environment Variable

Configure:

```env
VITE_API_URL=https://salonix.onrender.com
```

After changing the environment variable, redeploy the Vercel application.

The production frontend communicates with:

```text
https://salonix.onrender.com/api/
```

---

# 🔐 Authentication & Authorization

Salonix uses **JWT-based authentication**.

Authentication flow:

```text
User Login
    ↓
Django Authentication
    ↓
JWT Access + Refresh Tokens
    ↓
Frontend / Mobile Application
    ↓
Authorization Header
    ↓
Protected API Endpoints
```

Protected requests use:

```http
Authorization: Bearer <access_token>
```

Role-based permissions restrict access to:

* Customers
* Salon Owners/Managers
* Staff
* Platform Administrators

---

# 📅 Appointment Booking Flow

The main customer booking flow is:

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
Check Availability
  ↓
Select Time Slot
  ↓
Confirm Booking
  ↓
Appointment Created
```

The backend validates the booking again during confirmation to ensure that the selected slot is still available.

---

# 🧪 Automated Backend Tests

Run:

```bash
cd backend
python manage.py test
```

The test suite covers important backend functionality including:

1. User registration
2. JWT token issuance
3. Availability calculation
4. Appointment validation
5. Double-booking prevention
6. Database transaction locking

---

# 📚 API Documentation

Interactive Swagger/OpenAPI documentation:

```text
https://salonix.onrender.com/api/docs/
```

The API provides endpoints for:

* Authentication
* Users
* Salons
* Categories
* Services
* Staff
* Working hours
* Staff leave
* Availability
* Appointments
* Reviews
* Notifications
* Admin functionality

---

# 📁 Repository Structure

```text
salon/
│
├── backend/
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   │
│   ├── accounts/
│   │   └── Authentication, User & Profile models
│   │
│   ├── salons/
│   │   └── Salon, Category, Service, Staff, Hours & Leave
│   │
│   ├── appointments/
│   │   └── Appointment, Availability Engine & Booking Locks
│   │
│   ├── reviews/
│   │   └── Ratings & Reviews
│   │
│   └── common/
│       └── Shared permissions, pagination & admin functionality
│
├── web/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── context/
│   │
│   └── package.json
│
├── mobile/
│   ├── screens/
│   ├── components/
│   └── package.json
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATABASE_DESIGN.md
│   └── API_DOCUMENTATION.md
│
├── build_plan.md
├── requirements.txt
└── README.md
```

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │    Customer Web      │
                    │       Vercel         │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Django REST API    │
                    │       Render         │
                    └──────────┬───────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
       ┌─────────────────┐          ┌─────────────────┐
       │   PostgreSQL    │          │   JWT Auth      │
       │     Database    │          │                 │
       └─────────────────┘          └─────────────────┘
                ▲
                │
                │ REST API
                │
       ┌────────┴─────────┐
       │   Mobile App     │
       │ Expo / React     │
       │ Native           │
       └──────────────────┘
```

---

# 🗄️ Database Design

The platform uses a relational database structure covering:

* Users
* Roles
* Salons
* Categories
* Services
* Staff
* Working Hours
* Staff Leave
* Appointments
* Reviews
* Ratings
* Notifications

The appointment system maintains relationships between customers, salons, services, staff and scheduled time slots.

Detailed database documentation is available in:

```text
docs/DATABASE_DESIGN.md
```

---

# 🔒 Security & Validation

The application includes:

* JWT authentication
* Role-based permissions
* Protected API endpoints
* Backend-side validation
* Database transaction locking
* Double-booking prevention
* Appointment conflict validation
* Environment-based production secrets
* CORS configuration
* Production `DEBUG=False`
* PostgreSQL support

---

# 📊 Admin & Platform Management

The admin dashboard provides platform-level management for:

* Customers
* Salon owners
* Salons
* Staff
* Services
* Categories
* Appointments
* Reviews
* Ratings
* Platform statistics

Role-based access ensures that platform administration functionality is restricted to authorized administrators.

---

# 🎨 UI/UX

Salonix is designed as a modern, responsive booking platform with:

* Responsive layouts
* Multi-step booking experience
* Clear appointment statuses
* Salon and service discovery
* Role-specific dashboards
* Reusable UI components
* Mobile-friendly layouts
* Consistent navigation
* Interactive availability selection

---

# 📈 SEO & Performance

The public-facing marketing experience focuses on:

* Responsive design
* Semantic page structure
* Optimized frontend assets
* Reusable components
* Production build optimization
* Search-engine-friendly marketing content
* Mobile-friendly performance

---

# 🔄 Development Workflow

```text
Local Development
       ↓
Git
       ↓
GitHub
       ↓
Render Backend Deployment
       ↓
Vercel Frontend Deployment
       ↓
Production Testing
```

---

# 📝 Key Technical Decisions

### Django REST Framework

Django REST Framework was selected to provide a centralized backend API that can be consumed by both the React web application and React Native mobile application.

### JWT Authentication

JWT provides authentication suitable for both browser and mobile clients.

### PostgreSQL

PostgreSQL is used for production because of its reliability and transactional database capabilities.

### Database-Level Booking Protection

Appointment creation uses database transactions and row-level locking to reduce the risk of concurrent double bookings.

### Shared API

The web and mobile applications use the same API and business logic, avoiding duplicated backend functionality.

---

# 📌 Production Checklist

Before testing the live platform, verify:

* [ ] Render backend is running
* [ ] PostgreSQL database is connected
* [ ] Database migrations are applied
* [ ] Static files are collected
* [ ] Production `SECRET_KEY` is configured
* [ ] `DEBUG=False`
* [ ] `ALLOWED_HOSTS` is configured
* [ ] CORS allows the deployed frontend
* [ ] Vercel `VITE_API_URL` points to Render
* [ ] Mobile application points to the production API
* [ ] Demo accounts are available
* [ ] API documentation is accessible
* [ ] Customer booking flow works
* [ ] Appointment cancellation works
* [ ] Salon dashboard works
* [ ] Admin dashboard works
* [ ] Double-booking prevention works

---

# 📄 Additional Documentation

Project documentation is available in the `docs` directory:

```text
docs/
├── ARCHITECTURE.md
├── DATABASE_DESIGN.md
└── API_DOCUMENTATION.md
```

---

# 👨‍💻 Project Purpose

Salonix was developed as a full-stack product implementation demonstrating:

* Frontend development
* Backend API development
* Database design
* Authentication and authorization
* Role-based access control
* Appointment scheduling
* Availability calculation
* Concurrency handling
* Web and mobile integration
* Cloud deployment
* API documentation
* Responsive UI/UX

---

# 📬 Submission

### Source Code

The GitHub repository contains:

* Django REST backend
* React web application
* React Native mobile application
* Documentation
* Setup instructions
* Configuration information

### 🌐 Live Web Application

https://salonix-30wbdb30x-tusheta06s-projects.vercel.app/

### ⚙️ Production Backend API

https://salonix.onrender.com/api/

### 📚 Swagger API Documentation

https://salonix.onrender.com/api/docs/

### 📱 Mobile Application

The mobile application can be run through Expo Go using the instructions provided above.

---

# ⭐ SALONIX

**A complete salon discovery, scheduling and appointment management platform built with Django, React and React Native.**

> **"Your next beauty appointment is just a few clicks away."**
