const express = require('express');
const router = express.Router();
const {
  getAppointments,
  getDashboardStats,
  createAppointment,
  updateAppointmentStatus,
  updateAppointmentNotes,
  deleteAppointment,
} = require('../controllers/appointmentController');

// GET /api/appointments (with filters, search, and pagination)
router.get('/', getAppointments);

// GET /api/appointments/stats/dashboard
router.get('/stats/dashboard', getDashboardStats);

// POST /api/appointments
router.post('/', createAppointment);

// PUT /api/appointments/:id/status
router.put('/:id/status', updateAppointmentStatus);

// PUT /api/appointments/:id/notes
router.put('/:id/notes', updateAppointmentNotes);

// DELETE /api/appointments/:id
router.delete('/:id', deleteAppointment);

module.exports = router;