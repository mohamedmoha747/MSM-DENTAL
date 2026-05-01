const express = require('express');
const router = express.Router();

// GET /api/available-slots?date=YYYY-MM-DD&branch=...&doctor=...
router.get('/', (req, res) => {
  const { date, branch, doctor } = req.query;
  console.log('SLOTS API HIT', { date, branch, doctor });

  const slots = ['10:00 AM', '11:00 AM', '12:00 PM'];

  return res.json({
    date: date || null,
    branch: branch || null,
    doctor: doctor || null,
    slots,
    bookedSlots: [],
  });
});

module.exports = router;
