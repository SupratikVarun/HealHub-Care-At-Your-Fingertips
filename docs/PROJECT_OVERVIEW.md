# HealHub - Project Overview

## 🏥 About HealHub

HealHub is a comprehensive healthcare booking application that connects patients with doctors. The platform enables users to register as either patients or doctors, search for healthcare professionals by specialization, book appointments, and manage their healthcare interactions seamlessly.

**Tagline**: *Care at Your Fingertips*

---

## 🎯 Project Goals

1. **Simplify Healthcare Access**: Enable patients to easily find and book appointments with doctors
2. **Doctor Management**: Provide doctors with a platform to manage appointments and patient interactions
3. **Secure Authentication**: Implement robust phone and password-based authentication
4. **Role-Based Experience**: Deliver tailored dashboards and features for patients and doctors
5. **Appointment Management**: Allow both parties to manage, accept, decline, and communicate via appointments

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **CORS**: Express CORS middleware
- **Environment**: dotenv

### Frontend
- **Library**: React 19.x
- **Build Tool**: Vite
- **Routing**: React Router v7.x
- **Styling**: CSS
- **HTTP Client**: Fetch API
- **State Management**: React Context API

### Deployment
- **Backend**: Render.com
- **Frontend**: Vercel
- **Database**: MongoDB Atlas (Cloud)

---

## ✨ Key Features

### Authentication & Registration
- ✅ Patient registration with personal details (name, phone, age, gender, city)
- ✅ Doctor registration with specialization
- ✅ Phone + Password authentication
- ✅ Secure password hashing with bcryptjs
- ✅ JWT-based session management
- ✅ Role-based access control (Patient/Doctor)

### Patient Features
- ✅ Search doctors by name and specialization
- ✅ View doctor profiles and availability
- ✅ Book appointments with doctors
- ✅ View upcoming and past appointments
- ✅ Receive appointment status notifications
- ✅ Patient dashboard with appointment overview

### Doctor Features
- ✅ View appointment requests
- ✅ Accept or decline appointments
- ✅ Add decline messages for rejected appointments
- ✅ Manage upcoming and completed appointments
- ✅ Doctor dashboard with appointment management
- ✅ Update profile and specialization

### Additional Features
- ✅ Responsive UI design
- ✅ CORS support for cross-origin requests
- ✅ Error handling and validation
- ✅ Environment-based configuration
- ✅ Fallback UI when backend is unavailable

---

## 📦 Project Structure

```
HealHub/
├── backend/                    # Express.js backend server
│   ├── config/                # Configuration files
│   │   └── db.js             # MongoDB connection
│   ├── controllers/           # Request handlers
│   │   ├── authController.js # Authentication logic
│   │   ├── doctorController.js# Doctor operations
│   │   └── appointmentController.js# Appointment operations
│   ├── models/               # Mongoose schemas
│   │   ├── User.js          # User schema (Patient/Doctor)
│   │   └── Appointment.js   # Appointment schema
│   ├── routes/               # API routes
│   │   ├── auth.js          # Auth endpoints
│   │   ├── doctors.js       # Doctor endpoints
│   │   └── appointments.js  # Appointment endpoints
│   ├── middleware/           # Custom middleware
│   │   └── auth.js          # JWT verification
│   ├── index.js             # Express app setup
│   └── package.json         # Dependencies
│
├── frontend/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   └── Navbar.jsx   # Navigation component
│   │   ├── pages/           # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── PatientRegister.jsx
│   │   │   ├── DoctorRegister.jsx
│   │   │   ├── PatientDashboard.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── Doctors.jsx
│   │   │   ├── MyAppointments.jsx
│   │   │   └── BookAppointment.jsx
│   │   ├── context/         # Context API
│   │   │   └── AuthContext.jsx# Authentication state
│   │   ├── api.js           # API helper functions
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # React entry point
│   ├── public/              # Static assets
│   ├── vite.config.js       # Vite configuration
│   └── package.json         # Dependencies
│
└── docs/                      # Documentation (this directory)
```

---

## 🔐 Authentication Flow

1. **Registration**:
   - User selects role (Patient/Doctor)
   - Provides credentials (name, phone, password, etc.)
   - Password is hashed with bcryptjs
   - User record created in MongoDB
   - Redirect to Login page

2. **Login**:
   - User enters phone and password
   - Credentials verified against stored hash
   - JWT token generated
   - Token stored in localStorage
   - User redirected to appropriate dashboard

3. **Access Control**:
   - JWT token verified for protected routes
   - User role determines dashboard and features
   - Token expires based on JWT_SECRET settings

---

## 🌐 API Architecture

The backend provides RESTful APIs organized by resource:

### Authentication Endpoints
- `POST /api/auth/register-patient` - Patient registration
- `POST /api/auth/register-doctor` - Doctor registration
- `POST /api/auth/login` - User login

### Doctor Endpoints
- `GET /api/doctors` - List all doctors (with search/filter)
- `GET /api/doctors/:id` - Get doctor details
- `PUT /api/doctors/:id` - Update doctor profile

### Appointment Endpoints
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/patient/:id` - Patient's appointments
- `GET /api/appointments/doctor/:id` - Doctor's appointments
- `PUT /api/appointments/:id/accept` - Accept appointment
- `PUT /api/appointments/:id/decline` - Decline appointment

---

## 💾 Database Schema

### User Collection
- `_id`: ObjectId
- `name`: String
- `phone`: String (unique)
- `password`: String (hashed)
- `role`: String (patient/doctor)
- `specialization`: String (doctors only)
- `age`: Number
- `gender`: String
- `city`: String
- `createdAt`: Date
- `updatedAt`: Date

### Appointment Collection
- `_id`: ObjectId
- `patientId`: ObjectId (ref: User)
- `doctorId`: ObjectId (ref: User)
- `date`: Date
- `time`: String
- `status`: String (pending/accepted/declined/completed)
- `declineMessage`: String (optional)
- `createdAt`: Date
- `updatedAt`: Date

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB account (local or MongoDB Atlas)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/SupratikVarun/HealHub-Care-at-Your-Fingertips.git
   cd HealHub
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

---

## 📊 Application Flow

```
User
  ├─ Register (Patient/Doctor)
  │   └─ Login
  │       ├─ Patient
  │       │   ├─ Search Doctors
  │       │   ├─ Book Appointment
  │       │   └─ View My Appointments
  │       │
  │       └─ Doctor
  │           ├─ View Appointments
  │           ├─ Accept/Decline
  │           └─ Manage Schedule
  └─ Existing User
      └─ Login → Dashboard
```

---

## 🔄 Development Workflow

1. **Local Development**: Run backend and frontend with hot reload
2. **Testing**: Test features locally before committing
3. **Version Control**: Commit changes with meaningful messages
4. **Deployment**: Push to GitHub → Auto-deploy via Render (backend) and Vercel (frontend)

---

## 📝 Commit History

Recent implementation highlights:
- ✅ Phone + password authentication system
- ✅ Patient and doctor registration flows
- ✅ Search doctors by name and specialization
- ✅ Appointment booking and management
- ✅ Doctor appointment accept/decline workflow
- ✅ CORS configuration for local development
- ✅ UI improvements and responsive design

---

## 🐛 Known Issues & Improvements

### Current Limitations
- Backend API calls may fail if Render deployment is down (502 error)
- No email notifications yet
- Limited appointment time scheduling (date only, no time slots)

### Future Enhancements
- Email notifications for appointment confirmations
- SMS notifications for reminders
- Video consultation support
- Payment integration
- Prescription management
- Medical history tracking
- Advanced scheduling with time slots
- Doctor ratings and reviews

---

## 👥 Team

**Developer**: B Supratik Varun

---

## 📞 Support & Documentation

For detailed documentation:
- See [INDEX.md](./INDEX.md) for complete documentation index
- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- Review [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines

---

**Version**: 1.0.0  
**Last Updated**: June 2026  
**License**: MIT
