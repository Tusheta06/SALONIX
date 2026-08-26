# SALONIX — SALON & BEAUTY BOOKING PLATFORM

> **"Your next beauty appointment is just a few clicks away."**

Salonix is a full-stack, multi-role Salon & Beauty Booking Platform built to connect customers with salons, stylists, and real-time appointment scheduling.

---

## 🌟 Key Features

- **Unified Web Application**: Single React application powering Marketing, Customer Discovery & Multi-Step Booking, Salon Owner/Manager Dashboard, and Platform Admin Governance with role-based routing.
- **Shared Django REST API Backend**: Centralized API with JWT authentication, role-based access permissions, dynamic slot availability calculation, and atomic double-booking lock protection.
- **Customer Mobile Application**: React Native (Expo) app consuming the exact same backend endpoints.
- **Dynamic Availability Engine**: Calculates slot availability considering salon working hours, service duration, staff leave schedules, and existing non-cancelled bookings.
- **Atomic Double-Booking Prevention**: Database-level `select_for_update()` transaction locks during appointment confirmation.
- **Interactive Swagger Documentation**: Automated OpenAPI 3.0 schema at `/api/docs/`.

---

## 🛠️ Technology Stack

- **Backend**: Python 3.10+, Django 4.2+, Django REST Framework, SimpleJWT, Pillow, drf-spectacular, SQLite / PostgreSQL.
- **Web**: React 18, Vite 6, React Router 6, Axios, Tailwind CSS v3, Lucide Icons.
- **Mobile**: React Native, Expo SDK 51, React Navigation.

---

## 🔑 Seed Demo Accounts

All demo accounts use the standard password: **`password123`**

| Role | Email | Capabilities |
| :--- | :--- | :--- |
| **Admin** | `admin@salonix.demo` | Platform stats, salon approvals/suspensions, category management, user governance |
| **Salon Owner** | `owner@salonix.demo` | Manage salon profile, services catalog, staff, working hours, staff leave, appointments |
| **Customer** | `customer@salonix.demo` | Search salons, pick stylists, book real-time slots, manage booking history, submit reviews |
| **Staff Stylist** | `stylist@salonix.demo` | View assigned appointments and update treatment status |

*Note: The web login page includes a **One-Click Demo Account Filler** for instant switching between roles!*

---

## 🚀 Quick Start Guide

### 1. Backend Setup & Run

```bash
cd backend

# Activate Virtual Environment (Windows)
.\venv\Scripts\activate

# Install dependencies (already pre-installed in setup)
pip install -r requirements.txt

# Run Database Migrations
python manage.py migrate

# Seed Demo Data (5 Salons, Services, Staff, Working Hours, Appointments, Reviews)
python manage.py seed_demo_data

# Start Django API Server (runs on http://localhost:8000)
python manage.py runserver
```

- API Base Endpoint: `http://localhost:8000/api/`
- Interactive Swagger Docs: `http://localhost:8000/api/docs/`

### 2. Web Application Setup & Run

```bash
cd web

# Start Vite Development Server (runs on http://localhost:3000)
npm run dev
```

Open `http://localhost:3000` in your web browser.

### 3. Mobile Application Setup & Run

```bash
cd mobile

# Start Expo Development Server
npx expo start
```

---

## 🧪 Running Automated Backend Tests

```bash
cd backend
python manage.py test
```

Test suite verifies:
1. User registration & JWT Token issuance
2. Real-time slot calculation by Availability Engine
3. Atomic concurrency & double-booking prevention locks

---

## 📁 Repository Structure

```text
salon/
├── backend/                  # Django REST Framework backend
│   ├── config/               # Settings & URL routes
│   ├── accounts/             # Auth, User, Profile models
│   ├── salons/               # Salon, Category, Service, Staff, Hours, Leave
│   ├── appointments/         # Appointment model, Availability engine & Locks
│   ├── reviews/              # Rating & review management
│   └── common/               # Shared pagination, permissions, admin stats
├── web/                      # React Web App (Marketing, Customer, Salon, Admin)
│   ├── src/components/       # Navbar, Footer, RatingStars UI
│   ├── src/pages/            # Marketing, Auth, Customer, Salon, & Admin views
│   ├── src/services/         # Axios API client with JWT interceptors
│   └── src/context/          # AuthContext & BookingContext
├── mobile/                   # React Native (Expo) Customer Mobile App
├── docs/                     # ARCHITECTURE.md, DATABASE_DESIGN.md, API_DOCUMENTATION.md
└── build_plan.md             # Master Build Plan
```
