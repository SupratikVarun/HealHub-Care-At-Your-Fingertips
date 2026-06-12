# HealHub - Care at Your Fingertips

HealHub is a full-stack healthcare booking application built with a React/Vite frontend and an Express/MongoDB backend. It supports patient and doctor registration, secure phone/password authentication, role-aware dashboards, and appointment management.

## Project Structure

- `backend/`
  - `index.js` - Express application entry point
  - `config/db.js` - MongoDB connection logic
  - `controllers/` - Request handlers for auth, doctors, appointments
  - `models/` - Mongoose schemas for User and related entities
  - `routes/` - API route definitions
  - `middleware/` - Auth, error handling, and CORS utilities

- `frontend/`
  - `src/` - React application source files
  - `src/api.js` - API client helper
  - `src/context/AuthContext.jsx` - Authentication state and helpers
  - `src/pages/` - Login, registration, dashboard, and appointment pages
  - `src/components/` - Shared UI components such as `Navbar`

## Features

- Patient and doctor registration with secure password hashing
- Phone + password login
- Role-based dashboard redirects for patients and doctors
- Registration redirects to login after successful sign-up
- Backend CORS configuration for frontend access
- Environment-based API URL handling for local and deployed builds

## Local Development

### Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add:
   ```env
   MONGO_URI=<your mongo connection string>
   JWT_SECRET=<your jwt secret>
   CLIENT_SITE_URL=http://localhost:5173
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend dev server:
   ```bash
   npm run dev
   ```
4. Open the app in the browser:
   ```
   http://localhost:5173
   ```

## API Base URL

The frontend reads the backend URL from `VITE_API_BASE_URL`. If this variable is not set, it defaults to:

```js
http://localhost:5000/api
```

Set `VITE_API_BASE_URL` in your deployment environment to point to the live backend.

## Deployment

### Backend (Render)

- Configure `MONGO_URI` with your MongoDB connection string
- Configure `JWT_SECRET` with a secure secret
- Configure `CLIENT_SITE_URL` to your deployed frontend URL
- Deploy the backend with Node.js 18 or later

### Frontend (Vercel)

- Set `VITE_API_BASE_URL` to the deployed backend API URL, for example:
  ```env
  VITE_API_BASE_URL=https://your-backend.onrender.com/api
  ```
- Deploy the frontend app as a Vite React project

## Notes

- The frontend and backend are separate applications and deploy independently.
- Vite environment variables are applied at build time.
- CORS must allow the frontend origin to access backend APIs.

## License

This project is open for customization and learning.
