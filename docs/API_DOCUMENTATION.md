# SALONIX — REST API DOCUMENTATION

Interactive OpenAPI 3.0 / Swagger documentation is available at:
`http://localhost:8000/api/docs/`

---

## Authentication Endpoints

- `POST /api/auth/register/` — Register Customer or Salon Owner
- `POST /api/auth/login/` — Obtain JWT Access & Refresh Tokens
- `POST /api/auth/token/refresh/` — Refresh Access Token
- `GET /api/auth/me/` — Retrieve current authenticated user profile
- `PATCH /api/auth/me/` — Update user profile

---

## Salon & Service Endpoints

- `GET /api/salons/` — List salons (Supports `?search=`, `?city=`, `?category_id=`, `?min_rating=`)
- `GET /api/salons/{id}/` — Retrieve salon details with services, staff, working hours
- `GET /api/salons/my_salon/` — Retrieve owned salon for Salon Owner dashboard
- `GET /api/categories/` — List active service categories
- `GET /api/services/` — List services (Supports `?salon_id=`)
- `POST /api/services/` — Create new salon service
- `GET /api/staff/` — List staff members (Supports `?salon_id=`)

---

## Availability & Appointment Endpoints

- `GET /api/availability/` — Dynamic time slot calculator
  - Query Params: `salon_id`, `service_id`, `staff_id`, `date` (YYYY-MM-DD)
  - Returns real-time available time slots.
- `GET /api/appointments/` — List user appointments (Filtered by role: Customer sees own, Salon Owner sees salon's, Admin sees all)
- `POST /api/appointments/` — Reserve appointment with atomic double-booking lock
- `POST /api/appointments/{id}/cancel/` — Cancel appointment

---

## Review Endpoints

- `GET /api/reviews/` — List reviews (Supports `?salon_id=`)
- `POST /api/reviews/` — Submit review for completed appointment (1-5 stars)
