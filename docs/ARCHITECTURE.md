# SALONIX — PLATFORM ARCHITECTURE

## Overview

Salonix is an enterprise-grade multi-role Salon & Beauty Booking Platform built around a **Unified REST API** backend and two modular client applications:
1. **React Single Page Web Application** (Vite + React Router + Tailwind CSS) integrating Customer Discovery, Salon Owner/Manager Dashboard, Admin Governance, and Marketing.
2. **React Native (Expo) Mobile Application** built for Customer on-the-go appointment management using the exact same backend endpoints.

---

## High-Level Architecture Diagram

```text
                                SALONIX PLATFORM
                                       │
              ┌────────────────────────┴────────────────────────┐
              │                                                 │
    React Web Application                             React Native Expo Mobile
(Marketing + Customer + Salon + Admin)                    (Customer Mobile App)
              │                                                 │
              └────────────────────────┬────────────────────────┘
                                       │
                                   REST API
                                       │
                             Django REST Framework
                                       │
                                   PostgreSQL
```

---

## Backend Modules

- **`accounts`**: User management, custom email authentication, SimpleJWT token issuance, and profile relations.
- **`salons`**: Salon profiles, categories, service catalog, staff members, working hours schedule, and staff leave tracking.
- **`appointments`**: Real-time Availability Engine & atomic double-booking lock transaction processor.
- **`reviews`**: Rating management with automated salon rating aggregation.
- **`common`**: Standardized pagination, role-based permission classes, and platform statistics.

---

## Authentication & Security

- **JWT Authentication**: Short-lived Access Tokens (24 hours) and Refresh Tokens (7 days) with sliding rotation.
- **Backend Role-Based Access Control (RBAC)**: Custom permission classes (`IsCustomer`, `IsSalonOwnerOrManager`, `IsStaffMember`, `IsAdminUser`) enforced on every endpoint.
- **Atomic Locks**: Concurrency safety using `select_for_update()` database transactions during appointment reservation.
