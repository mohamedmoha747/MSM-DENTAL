const express = require('express');
const router = express.Router();

// GET /api/available-slots?date=YYYY-MM-DD&branch=...&doctor=...
router.get('/', (req, res) => {
  const { date, branch, doctor } = req.query;

  // Query parameters are accepted but not currently used to compute slots.
  // This endpoint returns dummy available time slots for the frontend.
  const availableSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM'];

  return res.json({
    date: date || null,
    branch: branch || null,
    doctor: doctor || null,
    availableSlots,
  });
});

module.exports = router;
