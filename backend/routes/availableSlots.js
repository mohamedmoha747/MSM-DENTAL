const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Doctor availability configuration (same as frontend)
const doctorAvailability = {
  sameer: {
    branches: ['Adirampattinam', 'Pattukkottai'],
    schedule: [
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
        branches: ['Pattukkottai'],
        intervals: [{ start: '09:30', end: '13:00' }],
      },
      {
        days: ['Friday', 'Sunday'],
        branches: ['Adirampattinam'],
        intervals: [{ start: '09:30', end: '13:00' }],
      },
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        branches: ['Adirampattinam'],
        intervals: [{ start: '17:00', end: '20:15' }],
      },
    ],
  },
  fahmitha: {
    branches: ['Adirampattinam'],
    schedule: [
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        branches: ['Adirampattinam'],
        intervals: [{ start: '10:00', end: '13:00' }],
      },
    ],
  },
};

// Helper functions
const getWeekDayName = (date) => {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const getAvailabilityIntervals = (doctor, branch, date) => {
  const docConfig = doctorAvailability[doctor];
  if (!docConfig?.schedule?.length) return [];

  const weekday = getWeekDayName(date);
  return docConfig.schedule
    .filter((entry) => entry.branches.includes(branch) && entry.days.includes(weekday))
    .flatMap((entry) => entry.intervals || []);
};

const generateTimeSlots = (interval, intervalMinutes = 20) => {
  if (!interval) return [];

  const [startHours, startMins] = interval.start.split(':').map(Number);
  const [endHours, endMins] = interval.end.split(':').map(Number);
  const start = startHours * 60 + startMins;
  const end = endHours * 60 + endMins;

  const slots = [];
  for (let minutes = start; minutes < end; minutes += intervalMinutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    slots.push(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
  }

  return slots;
};

// GET /api/available-slots?date=YYYY-MM-DD&branch=...&doctor=...
router.get('/', async (req, res) => {
  try {
    const { date, branch, doctor } = req.query;
    console.log('SLOTS API HIT', { date, branch, doctor });

    if (!date || !branch || !doctor) {
      return res.status(400).json({ message: 'Date, branch, and doctor are required' });
    }

    // Validate doctor
    if (!doctorAvailability[doctor]) {
      return res.status(400).json({ message: 'Invalid doctor selected' });
    }

    // Validate branch
    if (!doctorAvailability[doctor].branches.includes(branch)) {
      return res.status(400).json({ message: 'Invalid branch for selected doctor' });
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    // Generate all possible slots for this doctor/branch/date
    const intervals = getAvailabilityIntervals(doctor, branch, selectedDate);
    if (!intervals.length) {
      return res.json({
        date,
        branch,
        doctor,
        slots: [],
        bookedSlots: [],
        message: 'Doctor not available on this date for the selected branch'
      });
    }

    const allSlots = [];
    intervals.forEach((interval) => {
      allSlots.push(...generateTimeSlots(interval, 20));
    });

    // Get booked slots for this date/branch/doctor
    const startOfDay = new Date(selectedDate);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      branch,
      doctor,
      status: { $ne: 'Cancelled' } // Don't count cancelled appointments as booked
    }).select('time');

    const bookedSlots = bookedAppointments.map(apt => apt.time);

    // Filter out booked slots
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    console.log('Generated slots:', { allSlots, bookedSlots, availableSlots });

    return res.json({
      date,
      branch,
      doctor,
      slots: availableSlots,
      bookedSlots,
    });

  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
