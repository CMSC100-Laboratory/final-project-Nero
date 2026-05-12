# UmaMASA

This repository contains the source code for the **UmaMASA** e-commerce platform: a MERN stack application (MongoDB, Express, React, Node) with TypeScript. Customers browse a produce market, manage a cart, and track orders; administrators manage inventory, orders, users, and analytics.

## Features

### Customer experience

- **Authentication** — Sign up and sign in with role-based access (`user` vs `admin`).
- **Market (home)** — Browse available products and add items to the cart.
- **Shopping cart & checkout** — Review items and complete purchases.
- **Order history** — View past and current orders after checkout.
- **Assistant chatbot** — Floating helper on customer-facing pages for guidance and support-style interaction.

### Admin experience

- **Dashboard** — High-level overview of store activity and key metrics.
- **Order management** — Review, confirm, and complete customer orders through the workflow.
- **Inventory** — Maintain product listings (including image handling via Cloudinary on the backend).
- **User management** — Inspect and manage registered accounts.
- **Analytics / sales reporting** — Charts and summaries for sales performance.

### Platform

- **Responsive UI** with light/dark theme support on the admin sidebar.
- **REST API** with JWT-protected routes and separate admin endpoints.
- **Docker** configuration for production-style deployment.

## Screenshots

### Authentication

| Login        | Sign up        |
| ------------ | -------------- |
| Login screen | Sign up screen |

### Shopping (customer)

| Market        | Cart          | User orders |
| ------------- | ------------- | ----------- |
| Market / home | Shopping cart | User orders |

### Assistant

| Chatbot |
| ------- |
| Chatbot |

### Admin — navigation & dashboard

| Admin sidebar | Dashboard (1)   | Dashboard (2)                  |
| ------------- | --------------- | ------------------------------ |
| Admin sidebar | Admin dashboard | Admin dashboard alternate view |

### Admin — operations & analytics

| Admin orders | Inventory | User management | Analytics (1) | Analytics (2)       |
| ------------ | --------- | --------------- | ------------- | ------------------- |
| Admin orders | Inventory | User management | Analytics     | Analytics alternate |

## Usage guidelines

1. **Roles** — New registrations default to the **user** role. The first **admin** account is created when the backend starts if no admin exists and `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` are set in `backend/.env` (see [Local development setup](#local-development-setup)).
2. **Where things live** — After signing in as a **user**, use the main navigation for market, cart, checkout, and orders. After signing in as an **admin**, use the **admin sidebar** for dashboard, user management, inventory, order management, and analytics.
3. **Secrets** — Never commit real `.env` files. Use the provided `.env.example` files as templates only; rotate any credentials that were ever exposed.
4. **Database** — The app expects a reachable MongoDB Atlas (or compatible) URI. Without a valid `MONGODB_URI`, the API will not function correctly.
5. **Media uploads** — Product images rely on **Cloudinary** credentials in the backend `.env`. Missing or placeholder values may break or limit image upload features.
6. **Deployment** — Follow your team’s branching policy. This project is set up so pushes to `main` can sync to hosted frontend (Vercel) and backend (Render); avoid pushing experimental work directly to `main` unless you intend to release it.

## Prerequisites

- **Node.js** v18 or higher (recommended)
- **Git**
- **MongoDB** connection string (Atlas is typical for this project)
- Optional for full admin inventory flows: **Cloudinary** account (cloud name, API key, API secret)

## Local development setup

### 1. Clone the repository

```bash
git clone git@github.com:CMSC100-Laboratory/final-project-Nero.git
cd final-project-Nero
```

### 2. Install dependencies

From the repository root (installs root, frontend, and backend):

```bash
npm run install:all
```

### 3. Environment variables

**Backend — `backend/.env`**

Copy the example file and fill in real values:

```bash
cd backend
cp .env.example .env
```

Your `backend/.env` should include at least:

```env
PORT=4000
MONGODB_URI=<your MongoDB connection string>
CLIENT_URL=http://localhost:5173
NODE_ENV=development
JWT_SECRET=<a long random string used to sign sessions>

# Used once to seed the first admin if none exists
ADMIN_SEED_EMAIL=<admin email you will log in with>
ADMIN_SEED_PASSWORD=<strong password>

# Required for product image uploads
CLOUDINARY_CLOUD_NAME=<your Cloudinary cloud name>
CLOUDINARY_API_KEY=<your API key>
CLOUDINARY_API_SECRET=<your API secret>
```

Ask your course team or repository maintainer for shared dev credentials if the course provides them.

**Frontend — `frontend/.env`**

```bash
cd ../frontend
cp .env.example .env
```

Typical local content:

```env
VITE_API_URL=http://localhost:4000/api
```

### 4. Run the development servers

From the **repository root**:

```bash
cd ..
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:4000](http://localhost:4000)
- **Health check:** [http://localhost:4000/api/health](http://localhost:4000/api/health)

Log in with the seeded admin email/password after the backend has started at least once with valid admin seed variables, or register a new user for the customer flow.

## Useful scripts (run from repository root)

| Script                 | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Start frontend and backend together with hot reload. |
| `npm run dev:frontend` | Start only the Vite frontend.                        |
| `npm run dev:backend`  | Start only the Express backend.                      |
| `npm run build`        | Build backend then frontend for production.          |

## Deployment notes

- The project includes **Docker** for production-style deployment.
- Code pushed to `**main`** may be deployed automatically to **Vercel** (frontend) and **Render\*\* (backend). Coordinate with your team before pushing release-sensitive changes to `main`.
