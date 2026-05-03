const nodemailer = require('nodemailer');

// Create transporter function with fallback options
const createTransporter = () => {
  // Try different configurations in order of preference
  const configs = [
    // Primary: Gmail SMTP with STARTTLS on port 587 (recommended)
    {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        minVersion: 'TLSv1.2', // Modern TLS version
        rejectUnauthorized: false // Allow Gmail's certificate chain
      },
      // Remove family: 4 to allow both IPv4 and IPv6
      connectionTimeout: 60000,
      socketTimeout: 60000,
      greetingTimeout: 30000,
      logger: false, // Reduce log noise in production
      debug: false
    },
    // Fallback: Gmail SMTP with SSL on port 465
    {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: false // Allow Gmail's certificate chain
      },
      // Remove family: 4 to allow both IPv4 and IPv6
      connectionTimeout: 60000,
      socketTimeout: 60000,
      greetingTimeout: 30000,
      logger: false,
      debug: false
    }
  ];

  let lastError;
  for (const config of configs) {
    try {
      const transporter = nodemailer.createTransport(config);
      console.log(`Trying SMTP config: ${config.host}:${config.port} (secure: ${config.secure})`);
      return transporter;
    } catch (error) {
      console.log(`Config failed: ${error.message}`);
      lastError = error;
    }
  }

  throw lastError || new Error('No valid SMTP configuration found');
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

    console.log('Attempting to send email to:', appointmentData.email);
    const transporter = createTransporter();

    // Verify connection before sending
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError.message);
      throw new Error(`SMTP connection failed: ${verifyError.message}`);
    }

    const { name, email, date } = appointmentData;

    const mailOptions = {
      from: `"MSM Dental Clinic" <${process.env.EMAIL_USER}>`,
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

    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.command) {
      console.error('SMTP command:', error.command);
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