require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });
console.log('Loaded environment variables from:', envPath);
console.log('EMAIL_USER after load:', process.env.EMAIL_USER);
console.log('EMAIL_PASS after load:', process.env.EMAIL_PASS ? 'Loaded' : 'Missing');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Global request logger - LOGS ALL INCOMING REQUESTS
app.use((req, res, next) => {
  process.stdout.write(`\n🌐 INCOMING REQUEST: ${req.method} ${req.path}\n`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dental_clinic')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err.message));

// Routes
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/available-slots', require('./routes/availableSlots'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});