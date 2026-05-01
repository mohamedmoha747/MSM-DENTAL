const nodemailer = require('nodemailer');

// Create transporter function
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};






// Send appointment confirmation email
const sendAppointmentConfirmation = async (appointmentData) => {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
        process.env.EMAIL_USER === 'your-gmail@gmail.com' ||
        process.env.EMAIL_PASS === 'your-16-character-app-password') {
      console.log('Email not configured - skipping email send');
      return;
    }

    const transporter = createTransporter();
    const { name, email, date } = appointmentData;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Appointment Confirmation - MSM Dental Clinic',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Appointment Confirmed!</h2>
          <p>Hi ${name},</p>
          <p>Your appointment has been confirmed at ${new Date(date).toLocaleString()}.</p>
          <p>Thank you for choosing MSM Dental Clinic.</p>
          <p>If you have any questions, please contact us.</p>
          <br>
          <p>Best regards,<br>MSM Dental Clinic Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
    // Don't throw error to prevent appointment creation failure
  }
};

// Send WhatsApp notification for appointment
const sendWhatsAppNotification = async (appointmentData) => {
  try {
    // Check if WhatsApp credentials are configured
    if (!process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.WHATSAPP_ACCESS_TOKEN ||
        process.env.WHATSAPP_PHONE_NUMBER_ID === 'your-phone-number-id' ||
        process.env.WHATSAPP_ACCESS_TOKEN === 'your-whatsapp-access-token') {
      console.log('WhatsApp not configured - skipping WhatsApp send');
      return;
    }

    const { name, phone, date, branch } = appointmentData;
    
    // Format phone number (ensure it has country code)
    const formattedPhone = phone.startsWith('+') ? phone.replace(/\D/g, '') : '91' + phone.replace(/\D/g, '');
    
    const message = `Hello ${name},\n\nYour appointment has been confirmed at MSM Dental Clinic, ${branch}.\n\nAppointment Date & Time: ${new Date(date).toLocaleString()}\n\nThank you for choosing us!\n\nMSM Dental Clinic Team`;

    // Send WhatsApp message via Meta WhatsApp Business API
    const response = await fetch(
      `https://graph.instagram.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formattedPhone,
          type: 'text',
          text: {
            preview_url: false,
            body: message,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.statusText}`);
    }

    console.log('WhatsApp notification sent successfully');
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error.message);
    // Don't throw error to prevent appointment creation failure
  }
};

module.exports = {
  sendAppointmentConfirmation,
  sendWhatsAppNotification
};