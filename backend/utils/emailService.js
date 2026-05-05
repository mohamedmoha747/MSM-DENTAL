const nodemailer = require('nodemailer');

console.log('Creating transporter...');
console.log('EMAIL USER:', process.env.EMAIL_USER);
console.log('EMAIL PASS:', process.env.EMAIL_PASS ? 'Loaded' : 'Missing');
console.log('BREVO API KEY:', process.env.BREVO_API_KEY ? 'Loaded' : 'Missing');

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4, // FORCE IPv4
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 10000,
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify()
  .then(() => console.log('SMTP transporter verified and ready to send email'))
  .catch((error) => console.error('SMTP transport verification failed:', error.message || error));






// Send appointment confirmation email
const sendAppointmentConfirmation = async (appointmentData) => {
  try {
    console.log('Email function triggered');
    console.log('sendAppointmentConfirmation invoked for:', appointmentData?.email);

    if (!appointmentData || !appointmentData.email) {
      console.error('sendAppointmentConfirmation missing appointment email data');
      return;
    }

    console.log('ENV CHECK:', process.env.EMAIL_USER, process.env.EMAIL_PASS ? 'Loaded' : 'Missing');
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('EMAIL ENV NOT SET');
    }

    console.log('Attempting to send email to:', appointmentData.email);
    const { name, email, date } = appointmentData;

    // Use Brevo API instead of SMTP for Render compatibility
    const emailData = {
      sender: {
        name: "MSM Dental Clinic",
        email: process.env.EMAIL_USER
      },
      to: [{
        email: email,
        name: name
      }],
      subject: 'Appointment Confirmation - MSM Dental Clinic',
      htmlContent: `
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

    console.log('Sending email via Brevo API...');
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Brevo API error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    console.log('Confirmation email sent successfully via API:', result.messageId);
  } catch (error) {
    console.error('EMAIL ERROR FULL:', error);
    if (error && error.code) {
      console.error('Error code:', error.code);
    }
    if (error && error.response) {
      console.error('API response:', error.response);
    }
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