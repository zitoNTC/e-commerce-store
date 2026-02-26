# Traditional E-commerce (MVP)

Test and learning project created to practice structuring a full-stack system in a monorepo format, with a Django/DRF backend and a Next.js frontend.

The interface is intentionally simple: the main focus of this project is internal organization, data flow, and integration between application layers.

## Goal

- Practice building an organized and scalable project foundation.
- Practice separation of responsibilities between backend and frontend.
- Validate essential e-commerce flows in a functional MVP.

## Project Structure

- `backend/`: API built with Django + Django REST Framework.
- `frontend/`: web app built with Next.js (App Router).

## Main Features (MVP)

- Product catalog with filters.
- Shopping cart.
- Checkout and order listing.
- Admin area for product and tag management.
- Product autoload from seed data.

## Local Setup

### Backend

1. `cd backend`
2. `python -m venv .venv`
3. `.venv/Scripts/pip install -r requirements.txt`
4. `.venv/Scripts/python manage.py migrate`
5. `.venv/Scripts/python manage.py runserver`

### Frontend

1. `cd frontend`
2. `npm install`
3. Set `NEXT_PUBLIC_API_URL=http://localhost:8000` in your environment
4. `npm run dev`

## Note

This repository prioritizes learning and architecture. Visual improvements and UX refinements can be evolved later without compromising the structural base already in place.