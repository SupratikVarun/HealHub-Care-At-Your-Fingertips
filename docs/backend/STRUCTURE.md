# Backend - Project Structure & File Descriptions

Detailed breakdown of the backend folder structure and file purposes.

---

## 📂 Directory Structure

```
backend/
├── config/
│   └── db.js                    # MongoDB connection configuration
├── controllers/
│   ├── authController.js        # Authentication logic (register, login)
│   ├── doctorController.js      # Doctor search and retrieval
│   └── appointmentController.js # Appointment CRUD operations
├── models/
│   ├── User.js                  # User schema (Patients & Doctors)
│   └── Appointment.js           # Appointment schema
├── routes/
│   ├── auth.js                  # Auth endpoints routing
│   ├── doctors.js               # Doctor endpoints routing
│   └── appointments.js          # Appointment endpoints routing
├── middleware/
│   └── auth.js                  # JWT verification middleware
├── index.js                     # Main Express application
├── .env                         # Environment variables (not in git)
├── .env.example                 # Example environment file
├── .gitignore                   # Git ignore rules
├── package.json                 # NPM dependencies & scripts
├── package-lock.json            # Dependency lock file
└── render.yaml                  # Render deployment config
```

---

## 📝 File Descriptions

### **config/db.js**

**Purpose**: Establish MongoDB connection

**Key Functions**:
- `connectDB()` - Connects to MongoDB using Mongoose

**Usage**:
```javascript
import connectDB from "./config/db.js";
await connectDB();
```

**Output**:
- Logs connection success: `MongoDB connected: <host>`
- Exits process on connection failure

---

### **controllers/authController.js**

**Purpose**: Handle authentication operations

**Key Functions**:

1. **registerPatient()**
   - Validates patient input
   - Hashes password with bcryptjs
   - Creates patient record in MongoDB
   - Returns success/error response
   - Called by: `POST /api/auth/register-patient`

2. **registerDoctor()**
   - Validates doctor input including specialization
   - Hashes password
   - Creates doctor record
   - Returns success/error response
   - Called by: `POST /api/auth/register-doctor`

3. **login()**
   - Validates credentials (phone + password)
   - Compares password with stored hash
   - Generates JWT token on success
   - Returns token and user data
   - Called by: `POST /api/auth/login`

**Response Format**:
```javascript
{
  token: "eyJhbGciOiJIUzI1NiIs...",
  user: {
    _id: "...",
    name: "John",
    phone: "9876543210",
    role: "patient",
    email: "...",
    // ... other fields
  },
  message: "Login successful"
}
```

---

### **controllers/doctorController.js**

**Purpose**: Handle doctor-related operations

**Key Functions**:

1. **getDoctors()**
   - Retrieves all doctors or filtered list
   - Supports search by name: `?name=John`
   - Supports filter by specialization: `?specialization=Cardiologist`
   - Called by: `GET /api/doctors`

2. **getDoctorById()**
   - Gets single doctor details by ID
   - Called by: `GET /api/doctors/:id`

3. **updateDoctorProfile()**
   - Updates doctor's information
   - Requires authentication
   - Called by: `PUT /api/doctors/:id`

**Response Format** (getDoctors):
```javascript
{
  doctors: [
    {
      _id: "...",
      name: "Dr. Smith",
      specialization: "Cardiologist",
      // ... other fields
    }
  ]
}
```

---

### **controllers/appointmentController.js**

**Purpose**: Handle appointment management

**Key Functions**:

1. **createAppointment()**
   - Creates new appointment request
   - Links patient and doctor
   - Sets initial status to "pending"
   - Called by: `POST /api/appointments`

2. **getPatientAppointments()**
   - Retrieves all appointments for a patient
   - Called by: `GET /api/appointments/patient/:id`

3. **getDoctorAppointments()**
   - Retrieves all appointments for a doctor
   - Called by: `GET /api/appointments/doctor/:id`

4. **acceptAppointment()**
   - Doctor accepts appointment request
   - Updates status to "accepted"
   - Called by: `PUT /api/appointments/:id/accept`

5. **declineAppointment()**
   - Doctor declines appointment
   - Updates status to "declined"
   - Stores decline message
   - Called by: `PUT /api/appointments/:id/decline`

**Response Format** (getAppointments):
```javascript
{
  appointments: [
    {
      _id: "...",
      patientId: { name: "John", phone: "..." },
      doctorId: { name: "Dr. Smith", ... },
      date: "2026-06-15",
      time: "10:00",
      status: "pending",
      declineMessage: null,
      createdAt: "2026-06-13T..."
    }
  ]
}
```

---

### **models/User.js**

**Purpose**: Define User schema (Patient & Doctor)

**Fields**:

```javascript
{
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['patient', 'doctor'],
    required: true
  },
  specialization: {
    type: String,  // For doctors only
    required: function() { return this.role === 'doctor'; }
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  city: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Validation Rules**:
- Phone must be unique
- Role must be 'patient' or 'doctor'
- Doctors must provide specialization
- Password auto-hashed before save

---

### **models/Appointment.js**

**Purpose**: Define Appointment schema

**Fields**:

```javascript
{
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'completed'],
    default: 'pending'
  },
  declineMessage: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Relationships**:
- References User model for patientId
- References User model for doctorId
- Uses Mongoose populate for detailed user info

---

### **routes/auth.js**

**Purpose**: Define authentication endpoints

**Endpoints**:

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| POST | `/api/auth/register-patient` | `registerPatient` | Register new patient |
| POST | `/api/auth/register-doctor` | `registerDoctor` | Register new doctor |
| POST | `/api/auth/login` | `login` | Login user |

**Example Routes**:
```javascript
router.post('/register-patient', registerPatient);
router.post('/register-doctor', registerDoctor);
router.post('/login', login);
```

---

### **routes/doctors.js**

**Purpose**: Define doctor endpoints

**Endpoints**:

| Method | Endpoint | Function | Auth Required |
|--------|----------|----------|---|
| GET | `/api/doctors` | `getDoctors` | No |
| GET | `/api/doctors/:id` | `getDoctorById` | No |
| PUT | `/api/doctors/:id` | `updateDoctorProfile` | Yes |

**Query Parameters for GET /api/doctors**:
- `name`: Search by doctor name
- `specialization`: Filter by specialization

Example: `GET /api/doctors?name=Smith&specialization=Cardiologist`

---

### **routes/appointments.js**

**Purpose**: Define appointment endpoints

**Endpoints**:

| Method | Endpoint | Function | Auth Required |
|--------|----------|----------|---|
| POST | `/api/appointments` | `createAppointment` | Yes |
| GET | `/api/appointments/patient/:id` | `getPatientAppointments` | Yes |
| GET | `/api/appointments/doctor/:id` | `getDoctorAppointments` | Yes |
| PUT | `/api/appointments/:id/accept` | `acceptAppointment` | Yes |
| PUT | `/api/appointments/:id/decline` | `declineAppointment` | Yes |

---

### **middleware/auth.js**

**Purpose**: Verify JWT tokens on protected routes

**Function**: `auth(req, res, next)`

**Logic**:
1. Extract token from `Authorization: Bearer <token>` header
2. Verify token using JWT_SECRET
3. Attach decoded user ID to `req.userId`
4. Call `next()` to proceed
5. Return 401 error if token invalid/missing

**Usage**:
```javascript
router.get('/appointments/patient/:id', auth, getPatientAppointments);
```

---

### **index.js**

**Purpose**: Main Express application setup

**Key Setup**:

1. **Imports Dependencies**
   ```javascript
   import express from "express";
   import cors from "cors";
   import dotenv from "dotenv";
   import connectDB from "./config/db.js";
   ```

2. **Initialize Express App**
   ```javascript
   const app = express();
   ```

3. **Load Environment Variables**
   ```javascript
   dotenv.config();
   ```

4. **Configure Middleware**
   ```javascript
   app.use(cors({ origin: process.env.CLIENT_SITE_URL }));
   app.options('*', cors()); // Preflight
   app.use(express.json());
   ```

5. **Connect Database**
   ```javascript
   await connectDB();
   ```

6. **Import Routes**
   ```javascript
   import authRoutes from "./routes/auth.js";
   import doctorRoutes from "./routes/doctors.js";
   import appointmentRoutes from "./routes/appointments.js";
   ```

7. **Mount Routes**
   ```javascript
   app.use("/api/auth", authRoutes);
   app.use("/api/doctors", doctorRoutes);
   app.use("/api/appointments", appointmentRoutes);
   ```

8. **Health Check Endpoint**
   ```javascript
   app.get("/api/health", (req, res) => {
     res.json({ message: "Backend is running" });
   });
   ```

9. **Start Server**
   ```javascript
   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

---

### **.env.example**

**Purpose**: Template for environment variables

**Contents**:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healhub
JWT_SECRET=your-secret-key-here
CLIENT_SITE_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

---

### **package.json**

**Purpose**: Define dependencies and scripts

**Key Fields**:

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "HealHub Backend Server",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "mongoose": "^8.4.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5"
  },
  "devDependencies": {
    "nodemon": "^3.1.2"
  }
}
```

---

### **render.yaml**

**Purpose**: Render.com deployment configuration

**Key Configuration**:
```yaml
services:
  - type: web
    name: healhub-backend
    env: node
    plan: free
    startCommand: npm start
    envVars:
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: CLIENT_SITE_URL
        sync: false
```

See [deployment/RENDER_DEPLOYMENT.md](../deployment/RENDER_DEPLOYMENT.md) for details.

---

## 🔄 Request Flow Examples

### Login Flow

```
User Input (phone, password)
       ↓
POST /api/auth/login
       ↓
routes/auth.js → authController.login()
       ↓
Find user by phone
       ↓
Compare password with bcryptjs
       ↓
Generate JWT token
       ↓
Return token + user data
       ↓
Frontend stores token in localStorage
```

### Book Appointment Flow

```
Patient selects doctor
       ↓
POST /api/appointments
       ↓
middleware/auth.js (verify JWT)
       ↓
appointmentController.createAppointment()
       ↓
Validate patient & doctor IDs
       ↓
Create Appointment document in MongoDB
       ↓
Return appointment details
       ↓
Frontend shows confirmation
```

---

## 📚 Related Documentation

- [Backend Setup](./SETUP.md)
- [Backend Middleware](./MIDDLEWARE.md)
- [Database Schema](../architecture/DATABASE_SCHEMA.md)
- [API Documentation](../api/)

---

**Version**: 1.0.0  
**Last Updated**: June 2026
