# Backend - Setup & Configuration

Complete guide for backend setup and configuration.

---

## 📁 Backend Location

```
HealHub/backend/
```

---

## 🔧 Installation

### Step 1: Navigate to Backend

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with:

```env
# MongoDB URI
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/healhub?retryWrites=true&w=majority

# JWT Secret (generate a secure key)
JWT_SECRET=your-super-secret-key-min-32-characters

# Frontend URL for CORS
CLIENT_SITE_URL=http://localhost:5173

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

### Step 4: Start Server

**Development** (with auto-reload):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

---

## 📦 Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.19.2 | Web framework |
| mongoose | ^8.4.1 | MongoDB ODM |
| bcryptjs | ^2.4.3 | Password hashing |
| jsonwebtoken | ^9.0.2 | JWT tokens |
| cors | ^2.8.5 | CORS middleware |
| dotenv | ^16.4.5 | Environment variables |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| nodemon | ^3.1.2 | Auto-reload server |

---

## 🚀 NPM Scripts

```json
{
  "start": "node index.js",          // Production
  "dev": "nodemon index.js"          // Development
}
```

### Usage

```bash
npm start    # Production mode
npm run dev  # Development with auto-reload
```

---

## ⚙️ Configuration Files

### config/db.js

Handles MongoDB connection setup:

```javascript
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected:", conn.connection.host);
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
```

**Key Features**:
- Connects to MongoDB using connection string from `.env`
- Handles connection errors gracefully
- Exits process if connection fails

---

## 📊 Database Models

### User Schema

Located in: `models/User.js`

```javascript
{
  name: String (required),
  phone: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['patient', 'doctor']),
  specialization: String (doctors only),
  age: Number,
  gender: String (enum: ['male', 'female', 'other']),
  city: String,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Appointment Schema

Located in: `models/Appointment.js`

```javascript
{
  patientId: ObjectId (ref: User),
  doctorId: ObjectId (ref: User),
  date: Date,
  time: String,
  status: String (enum: ['pending', 'accepted', 'declined', 'completed']),
  declineMessage: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Health Check

```
GET /api/health
Response: { "message": "Backend is running" }
```

### Authentication

```
POST /api/auth/register-patient
POST /api/auth/register-doctor
POST /api/auth/login
```

### Doctors

```
GET /api/doctors              # List all with search
GET /api/doctors/:id          # Get one
PUT /api/doctors/:id          # Update profile
```

### Appointments

```
POST /api/appointments                    # Create
GET /api/appointments/patient/:id         # Patient's
GET /api/appointments/doctor/:id          # Doctor's
PUT /api/appointments/:id/accept          # Accept
PUT /api/appointments/:id/decline         # Decline
```

See [api/](../api/) directory for detailed endpoint documentation.

---

## 🛡️ Middleware

### Authentication Middleware

Located in: `middleware/auth.js`

Verifies JWT tokens on protected routes:

```javascript
import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export default auth;
```

**Usage**:
```javascript
router.get('/appointments', auth, getAppointments);
```

### CORS Middleware

Configured in `index.js`:

```javascript
app.use(cors({
  origin: process.env.CLIENT_SITE_URL,
  credentials: true
}));

// Handle preflight
app.options('*', cors());
```

---

## 🔐 Security Features

### Password Hashing

Uses `bcryptjs` during registration:

```javascript
import bcryptjs from "bcryptjs";

// Hashing
const salt = await bcryptjs.genSalt(10);
user.password = await bcryptjs.hash(password, salt);

// Verification
const isValid = await bcryptjs.compare(password, user.password);
```

### JWT Authentication

Creates tokens after login:

```javascript
import jwt from "jsonwebtoken";

const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
```

---

## 📝 Request/Response Format

### Request Headers

```
Content-Type: application/json
Authorization: Bearer <jwt_token>  // For protected routes
```

### Response Format (Success)

```json
{
  "success": true,
  "data": { /* resource data */ },
  "message": "Operation successful"
}
```

### Response Format (Error)

```json
{
  "success": false,
  "error": "Error message",
  "code": 400
}
```

---

## 🗂️ Folder Structure

```
backend/
├── config/
│   └── db.js                    # MongoDB connection
├── controllers/
│   ├── authController.js        # Auth endpoints
│   ├── doctorController.js      # Doctor operations
│   └── appointmentController.js # Appointment operations
├── models/
│   ├── User.js                  # User schema
│   └── Appointment.js           # Appointment schema
├── routes/
│   ├── auth.js                  # Auth routes
│   ├── doctors.js               # Doctor routes
│   └── appointments.js          # Appointment routes
├── middleware/
│   └── auth.js                  # JWT verification
├── index.js                     # Main Express app
├── .env                         # Environment variables (local only)
├── .env.example                 # Example env file
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
└── render.yaml                  # Render deployment config
```

---

## 🔄 Request Flow Example

**Patient Registration Flow**:

1. Frontend sends: `POST /api/auth/register-patient`
2. `routes/auth.js` routes to `authController.registerPatient()`
3. Controller validates input
4. Hashes password with bcryptjs
5. Creates User in MongoDB via Mongoose
6. Returns JWT token and user data
7. Frontend stores token and redirects to login

---

## 🚀 Deployment

### Local Testing

```bash
npm run dev
```

### Production Build

```bash
npm start
```

### Environment Variables (Production)

Ensure these are set in production:

- `MONGO_URI`: Production MongoDB connection
- `JWT_SECRET`: Strong random string (min 32 chars)
- `CLIENT_SITE_URL`: Production frontend URL
- `NODE_ENV`: Set to 'production'

### Render Deployment

See [deployment/RENDER_DEPLOYMENT.md](../deployment/RENDER_DEPLOYMENT.md)

---

## 🐛 Common Issues

### MongoDB Connection Failed

Check `.env` MONGO_URI and MongoDB service status.

### CORS Errors

Ensure `CLIENT_SITE_URL` matches frontend URL in `.env`.

### JWT Errors

Verify `JWT_SECRET` is set and consistent.

### Port Already in Use

Change `PORT` in `.env` or kill the process using the port.

---

## 📚 Related Documentation

- [Backend Structure](./STRUCTURE.md)
- [Backend Middleware](./MIDDLEWARE.md)
- [Database Schema](../architecture/DATABASE_SCHEMA.md)
- [API Documentation](../api/)
- [Deployment Guide](../deployment/)

---

**Version**: 1.0.0  
**Last Updated**: June 2026
