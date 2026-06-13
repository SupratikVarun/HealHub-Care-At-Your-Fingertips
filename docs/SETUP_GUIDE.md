# HealHub - Setup Guide

Complete guide to set up HealHub for local development.

---

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** v14.0.0 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **MongoDB Account** (Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Code Editor** (VS Code recommended)

### Verify Installation
```bash
node --version
npm --version
git --version
```

---

## 🔧 Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/SupratikVarun/HealHub-Care-at-Your-Fingertips.git
cd HealHub
```

### 2. Project Structure Check

```
HealHub/
├── backend/
├── frontend/
└── docs/
```

---

## 🖥️ Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `nodemon` - Auto-reload during development

### Step 3: Create Environment File

```bash
# Copy the example file
cp .env.example .env

# Or create manually
echo > .env
```

### Step 4: Configure Environment Variables

Edit `.env` file with your settings:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healhub?retryWrites=true&w=majority
# OR for local MongoDB:
# MONGO_URI=mongodb://localhost:27017/healhub

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Client URL for CORS
CLIENT_SITE_URL=http://localhost:5173

# Server Port
PORT=5000
```

#### Getting MongoDB URI

**Option A: MongoDB Atlas (Recommended for Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/healhub`
5. Replace `username`, `password`, and `cluster` with your values

**Option B: Local MongoDB**
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/healhub`

### Step 5: Start Backend Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Expected output:
```
Server running on http://localhost:5000
Database connected successfully
```

### Verify Backend

```bash
# In another terminal
curl http://localhost:5000/api/health
```

Expected response:
```json
{ "message": "Backend is running" }
```

---

## ⚛️ Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- `react` - UI library
- `react-dom` - React DOM utilities
- `react-router-dom` - Routing
- `vite` - Build tool
- Linting and development tools

### Step 3: Configure Environment Variables (Optional)

Frontend automatically connects to backend via Vite proxy (defined in `vite.config.js`):

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true
    }
  }
}
```

For production deployments, you may set:
```bash
# .env.production
VITE_API_BASE_URL=https://your-backend-url.com
```

### Step 4: Start Frontend Development Server

```bash
npm run dev
```

Expected output:
```
VITE v8.0.12  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### Step 5: Verify Frontend

Open your browser and navigate to: `http://localhost:5173/`

You should see the HealHub application homepage.

---

## ✅ Complete Setup Verification

### Checklist

- [ ] Backend running on `http://localhost:5000`
- [ ] Frontend running on `http://localhost:5173`
- [ ] MongoDB connection successful
- [ ] Both npm processes show no errors
- [ ] No CORS errors in browser console
- [ ] API health endpoint responds

### Test the Application

1. **Register as Patient**
   - Go to `http://localhost:5173/register-patient`
   - Fill in form with test data
   - Submit and redirect to login page

2. **Login as Patient**
   - Go to `http://localhost:5173/login`
   - Enter registered phone and password
   - Should redirect to patient dashboard

3. **Search Doctors**
   - From patient dashboard, go to Doctors page
   - Search by name or specialization
   - View doctor results

4. **Register as Doctor**
   - Go to `http://localhost:5173/register-doctor`
   - Fill in form with specialization
   - Login to doctor dashboard

---

## 🔄 Development Workflow

### Terminal Setup (Recommended)

Open 3 terminals:

**Terminal 1 - Backend:**
```bash
cd HealHub/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd HealHub/frontend
npm run dev
```

**Terminal 3 - Git/Utility:**
```bash
cd HealHub
# Use for git commands, checking logs, etc.
```

### Hot Reload

- **Backend**: Changes auto-reload via `nodemon`
- **Frontend**: Changes auto-reload via Vite
- No need to restart servers during development

### Making Changes

1. Edit files in `backend/` or `frontend/`
2. Changes auto-reload
3. Test in browser/API client
4. Commit when satisfied

---

## 🐛 Troubleshooting

### MongoDB Connection Failed

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**:
- Check MongoDB is running (local) or accessible (Atlas)
- Verify connection string in `.env`
- Check firewall settings
- Ensure IP is whitelisted in Atlas

### Port Already in Use

**Error**: `Error: listen EADDRINUSE :::5000`

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### CORS Errors

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**:
- Ensure frontend is at `http://localhost:5173`
- Verify backend `.env` has `CLIENT_SITE_URL=http://localhost:5173`
- Check backend CORS middleware is configured

### npm Install Issues

**Error**: `npm ERR! code ERESOLVE`

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Retry install
npm install
```

### Module Not Found

**Error**: `Cannot find module 'express'`

**Solution**:
```bash
# Make sure you're in backend directory
cd backend

# Reinstall dependencies
npm install
```

### Frontend Build Errors

**Error**: `Failed to resolve import`

**Solution**:
```bash
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

---

## 📚 Next Steps

After successful setup:

1. **Explore the Code**: Read [backend/STRUCTURE.md](./backend/STRUCTURE.md) and [frontend/STRUCTURE.md](./frontend/STRUCTURE.md)
2. **Understand API**: Review [api/](./api/) documentation
3. **Learn Architecture**: Check [architecture/ARCHITECTURE.md](./architecture/ARCHITECTURE.md)
4. **Make Changes**: Start modifying and building features
5. **Deploy**: Follow [deployment/DEPLOYMENT_GUIDE.md](./deployment/DEPLOYMENT_GUIDE.md)

---

## 💡 Tips & Best Practices

### During Development

- Always run both backend and frontend
- Check browser console for errors
- Use browser DevTools to inspect network requests
- Keep terminal outputs visible to spot errors early
- Make frequent git commits

### Environment Variables

- Never commit `.env` to git
- Keep `.env.example` updated with new variables needed
- Use meaningful, descriptive variable names
- Document each variable's purpose

### Code Organization

- Keep related files together
- Follow existing naming conventions
- Add comments for complex logic
- Test features locally before pushing

---

## 🚀 Ready to Start?

Your HealHub development environment is now ready!

**Next**: Follow the [CONTRIBUTING.md](./CONTRIBUTING.md) guide for development workflow guidelines.

---

**Version**: 1.0.0  
**Last Updated**: June 2026
