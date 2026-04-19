# Farm-To-Table (CMSC100 Final Project)

This repository contains the source code for the Farm-To-Table e-commerce platform, built using the MERN stack with TypeScript.

## Prerequisites

Before starting, ensure you have the following installed on your machine:

- Node.js (v18 or higher recommended)
- Git

## Local Development Setup

Follow these steps to get the project running on your local machine.

### 1. Clone the repository

```bash
git clone git@github.com:CMSC100-Laboratory/final-project-Nero.git
cd final-project-Nero
```

### 2. Install dependencies

Run the following command from the root directory. This will install dependencies for the root workspace, the frontend, and the backend all at once:

```bash
npm run install:all
```

### 3. Set up environment variables

You need to create local environment files for both the frontend and backend. Templates are provided.

**Backend (.env)**
Navigate to the `backend` directory, copy the example file, and update it with the MongoDB Atlas connection string (ask the repository owner for the database credentials):

```bash
cd backend
cp .env.example .env
```

Ensure your `backend/.env` looks like this:

```env
PORT=4000
MONGODB_URI=<Replace with the provided Atlas connection string>
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend (.env)**
Navigate to the `frontend` directory and copy the example file:

```bash
cd ../frontend
cp .env.example .env
```

Ensure your `frontend/.env` looks like this:

```env
VITE_API_URL=http://localhost:4000/api
```

### 4. Run the development servers

Return to the root directory of the project and start both the frontend and backend concurrently:

```bash
cd ..
npm run dev
```

- The frontend will be available at: http://localhost:5173
- The backend API will be available at: http://localhost:4000
- You can test the backend health route at: http://localhost:4000/api/health

## Useful Scripts (Run from root)

- `npm run dev`: Starts both frontend and backend in development mode with hot-reloading.
- `npm run dev:frontend`: Starts only the frontend.
- `npm run dev:backend`: Starts only the backend.
- `npm run build`: Compiles TypeScript and builds both projects for production.

## Deployment Notes

- The project is configured with Docker for production deployment.
- Code pushed to the `main` branch is automatically synced and deployed to Vercel (Frontend) and Render (Backend). Do not push directly to `main` unless you are releasing a feature.

  
