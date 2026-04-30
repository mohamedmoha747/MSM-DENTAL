# 🚀 Production Deployment & Security Guide

## 🔒 Security Setup (CRITICAL)

### 1. Change Admin Password

**File**: `frontend/src/components/Admin.js`
**Location**: Line ~50

**Current Code**:
```javascript
const handleLogin = () => {
  if (password === 'admin123') {
    setAuthenticated(true);
    fetchAppointments(1);
    fetchDashboardStats();
  } else {
    alert('❌ Invalid password');
  }
};
```

**Action Required**: 
Replace `'admin123'` with a strong password:
```javascript
if (password === 'YourSecurePassword123!@#') {
```

**Password Requirements**:
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Not common words or patterns
- Example: `SecureAdmin2024!@#Dental`

### 2. Implement Token-Based Authentication (RECOMMENDED)

Instead of hardcoded password, implement JWT:

**Backend** (`backend/middleware/auth.js`):
```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
```

**Backend** (`backend/routes/auth.js`):
```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Verify credentials (hash stored passwords)
  if (email === process.env.ADMIN_EMAIL && 
      password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email: email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
```

### 3. Environment Variables Setup

**File**: `.env` (Create in backend root)

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dental_clinic

# JWT
JWT_SECRET=your_super_secret_key_here_min_32_chars

# Admin Credentials
ADMIN_EMAIL=admin@dentalclinic.com
ADMIN_PASSWORD=SecurePassword123!@#

# Server
PORT=5000
NODE_ENV=production

# Frontend
REACT_APP_API_URL=https://api.yourdomain.com
```

**⚠️ IMPORTANT**: Add `.env` to `.gitignore`
```
echo ".env" >> .gitignore
```

---

## 🌐 API Endpoint Deployment

### 1. Deploy Backend to Heroku

**Step 1**: Create `Procfile` in backend root:
```
web: node server.js
```

**Step 2**: Install Heroku CLI and deploy:
```bash
cd backend
heroku login
heroku create dental-clinic-api
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
git push heroku main
```

### 2. Deploy Backend to DigitalOcean

**Using App Platform**:
1. Connect GitHub repository
2. Set environment variables
3. Set build command: `npm install`
4. Set run command: `npm start`
5. Deploy

### 3. Update Frontend API URL

**File**: `frontend/src/components/Admin.js`
**Replace all instances**:
```javascript
// Development
'http://localhost:5000/api/appointments'

// Production
'https://api.yourdomain.com/api/appointments'
```

Use environment variables:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Then use:
`${API_BASE_URL}/api/appointments`
```

**`.env.production` file** (create in frontend root):
```
REACT_APP_API_URL=https://api.yourdomain.com
```

---

## 🔐 CORS Configuration

**File**: `backend/server.js`

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    'http://localhost:3000' // For development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

---

## 🛡️ Input Validation & Sanitization

**File**: `backend/controllers/appointmentController.js`

Add validation before processing:

```javascript
const validator = require('validator');

const createAppointment = async (req, res) => {
  let { name, phone, email, date, message } = req.body;

  // Sanitize inputs
  name = validator.escape(name.trim());
  phone = validator.escape(phone.trim());
  email = validator.normalizeEmail(email);
  message = validator.escape(message.trim());

  // Validate
  if (!name || name.length < 2) {
    return res.status(400).json({ message: 'Invalid name' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email' });
  }
  if (!validator.isMobilePhone(phone)) {
    return res.status(400).json({ message: 'Invalid phone' });
  }
  if (!validator.isISO8601(date)) {
    return res.status(400).json({ message: 'Invalid date' });
  }

  // ... rest of logic
};
```

Install validator:
```bash
npm install validator
```

---

## 📦 Database Optimization

### 1. Create MongoDB Indexes

**File**: `backend/models/Appointment.js`

```javascript
appointmentSchema.index({ name: 'text', phone: 'text' }); // For search
appointmentSchema.index({ date: -1 }); // For sorting by date
appointmentSchema.index({ status: 1 }); // For filtering
appointmentSchema.index({ createdAt: -1 }); // For recent appointments
```

### 2. MongoDB Atlas Settings

1. Go to https://www.mongodb.com/cloud/atlas
2. Create cluster with:
   - Min 2 nodes (High Availability)
   - Daily backups enabled
   - Geographic replication
   - IP whitelist: Your production server IPs

### 3. Connection Pooling

**File**: `backend/server.js`

```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  maxPoolSize: 10,
  minPoolSize: 5,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority'
});
```

---

## 🔔 Error Logging & Monitoring

### Install Error Tracking (Sentry)

**Backend Setup**:
```bash
npm install @sentry/node
```

**File**: `backend/server.js`

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

**Frontend Setup** (React):
```bash
npm install @sentry/react
```

**File**: `frontend/src/index.js`

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

export default Sentry.withProfiler(App);
```

---

## 🚀 Performance Optimization

### 1. Enable Compression

**File**: `backend/server.js`

```javascript
const compression = require('compression');
app.use(compression());
```

Install: `npm install compression`

### 2. Rate Limiting

**File**: `backend/server.js`

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

Install: `npm install express-rate-limit`

### 3. Caching Headers

**File**: `backend/server.js`

```javascript
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  next();
});
```

### 4. Database Query Optimization

```javascript
// Bad - N+1 query problem
const appointments = await Appointment.find();
for (const apt of appointments) {
  const details = await AptDetails.findOne({ appointmentId: apt._id });
}

// Good - Use indexing and lean() for read-only
const appointments = await Appointment
  .find()
  .lean() // Returns plain objects, faster
  .limit(50)
  .sort({ date: -1 });
```

---

## 🔄 CI/CD Pipeline Setup

### GitHub Actions Workflow

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Install dependencies
      run: |
        cd backend
        npm install
        
    - name: Run tests
      run: |
        cd backend
        npm test
        
    - name: Deploy to Heroku
      env:
        HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
      run: |
        cd backend
        git push https://heroku:$HEROKU_API_KEY@git.heroku.com/dental-clinic-api.git main
```

---

## 🧪 Testing Script Before Production

Run this before deploying:

**File**: `test-deployment.sh`

```bash
#!/bin/bash

echo "Testing API endpoints..."

# Test 1: Health check
curl -X GET http://localhost:5000/api/appointments/stats/dashboard

# Test 2: Create appointment
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "+1234567890",
    "email": "test@example.com",
    "date": "2024-01-20T10:30:00Z",
    "message": "Test appointment"
  }'

# Test 3: Get appointments
curl -X GET http://localhost:5000/api/appointments?page=1&limit=10

echo "All tests completed!"
```

Run: `bash test-deployment.sh`

---

## 📋 Pre-Production Checklist

- [ ] Change admin password from 'admin123'
- [ ] Set up `.env` file with real credentials
- [ ] Configure MongoDB Atlas or deploy MongoDB
- [ ] Set CORS allowed origins
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure backups for database
- [ ] Set up error tracking (Sentry)
- [ ] Enable rate limiting
- [ ] Enable compression
- [ ] Create database indexes
- [ ] Test all API endpoints
- [ ] Test search, filters, pagination
- [ ] Test CSV export
- [ ] Test status updates
- [ ] Test notes editing
- [ ] Set up monitoring & alerts
- [ ] Document admin procedures for team
- [ ] Train staff on new features
- [ ] Set up logging
- [ ] Configure CDN for static files (optional)

---

## 🛠️ Maintenance & Monitoring

### Daily Tasks
- Monitor error logs in Sentry
- Check database performance
- Verify backups completed

### Weekly Tasks
- Review access logs
- Check database size
- Monitor API response times

### Monthly Tasks
- Review security patches
- Update dependencies: `npm audit`
- Analyze usage patterns
- Review and adjust rate limits if needed

---

## 🆘 Troubleshooting Production Issues

### API Not Responding
```
1. Check server logs: pm2 logs
2. Verify MongoDB connection
3. Check firewall rules
4. Restart service: pm2 restart all
```

### Slow Queries
```
1. Check MongoDB indexes
2. Review query performance
3. Implement pagination
4. Enable query caching
```

### High Memory Usage
```
1. Check for memory leaks
2. Implement connection pooling
3. Review database query efficiency
4. Enable compression
```

### CORS Errors
```
1. Verify origin in corsOptions
2. Check Content-Type header
3. Add Authorization header if needed
4. Check browser console for exact error
```

---

## 📊 Monitoring Metrics to Track

- API response times (target: < 200ms)
- Error rate (target: < 0.1%)
- Database query times (target: < 50ms)
- Server uptime (target: > 99.9%)
- Concurrent users
- Database storage used
- CPU usage (target: < 70%)
- Memory usage (target: < 80%)

---

## 🔐 Data Privacy/GDPR Compliance

Implement these features:

1. **Data Retention Policy**
   ```javascript
   // Delete appointments older than 2 years
   const twoYearsAgo = new Date(Date.now() - (2 * 365 * 24 * 60 * 60 * 1000));
   await Appointment.deleteMany({ createdAt: { $lt: twoYearsAgo } });
   ```

2. **Data Export for User**
   ```javascript
   // Allow users to request their data
   router.post('/appointments/user/export', (req, res) => {
     // Return all data for specific user
   });
   ```

3. **Data Deletion**
   ```javascript
   // Allow users to delete their data
   router.delete('/appointments/user/data', (req, res) => {
     // Delete appointment and related records
   });
   ```

---

## 📞 Deployment Support

For deployment help:
1. Check cloud provider documentation
2. Review logs in detail
3. Test locally first
4. Implement incrementally
5. Monitor after deployment

