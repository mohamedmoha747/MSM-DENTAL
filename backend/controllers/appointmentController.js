const Appointment = require('../models/Appointment');
const { sendAppointmentConfirmation } = require('../utils/emailService');

// Get all appointments with pagination and filtering
const getAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, branch, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = {};

    // Search filter (by name or phone)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Status filter
    if (status && status !== 'All') {
      filter.status = status;
    }

    // Branch filter
    if (branch && branch !== 'All') {
      filter.branch = branch;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    const total = await Appointment.countDocuments(filter);
    const appointments = await Appointment.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      appointments,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalAppointments = await Appointment.countDocuments();
    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: today, $lt: tomorrow },
    });
    const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });
    const completedAppointments = await Appointment.countDocuments({ status: 'Completed' });

    res.status(200).json({
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      completedAppointments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new appointment
const createAppointment = async (req, res) => {
  const { name, phone, email, branch, date, message } = req.body;

  if (!name || !phone || !email || !branch || !date || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!['Pattukkottai', 'Adirampattinam'].includes(branch)) {
    return res.status(400).json({ message: 'Invalid branch selected' });
  }

  try {
    const newAppointment = new Appointment({
      name,
      phone,
      email,
      branch,
      date,
      message,
      status: 'Pending',
      notes: '',
    });

    const savedAppointment = await newAppointment.save();

    // Send confirmation email
    await sendAppointmentConfirmation(savedAppointment);

    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update appointment notes
const updateAppointmentNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { notes, updatedAt: Date.now() },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAppointments,
  getDashboardStats,
  createAppointment,
  updateAppointmentStatus,
  updateAppointmentNotes,
  deleteAppointment,
};