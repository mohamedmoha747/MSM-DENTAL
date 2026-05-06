const nodemailer = require('nodemailer');

console.log('Email Service Initialized');
console.log('EMAIL_USER (Sender):', process.env.EMAIL_USER);
console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? 'Loaded' : 'MISSING - Email will fail!');

// Note: Using Brevo API v3 instead of SMTP for better reliability on serverless platforms
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: 'not-needed-using-api', // Placeholder - Brevo API is used instead
  },
  family: 4, // FORCE IPv4
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 10000,
  tls: {
    rejectUnauthorized: false,
  },
});






// Send appointment confirmation email
const sendAppointmentConfirmation = async (appointmentData) => {
  // IMMEDIATE LOG - force output
  process.stdout.write('[EMAIL] ⭐ FUNCTION CALLED for: ' + appointmentData?.email + '\n');
  
  try {
    console.log('[EMAIL] Starting email process...');

    if (!appointmentData || !appointmentData.email) {
      console.error('[EMAIL ERROR] Missing appointment or email data');
      return;
    }

    // Validate required environment variables
    if (!process.env.BREVO_API_KEY) {
      console.error('[EMAIL ERROR] BREVO_API_KEY is not set in .env file');
      return;
    }

    if (!process.env.EMAIL_USER) {
      console.error('[EMAIL ERROR] EMAIL_USER (sender email) is not set in .env file');
      return;
    }

    console.log('[EMAIL] ✓ Sender email:', process.env.EMAIL_USER);
    console.log('[EMAIL] ✓ Recipient:', appointmentData.email);

    const { name, email, date } = appointmentData;

    // Prepare email payload for Brevo API v3
    const emailData = {
      sender: {
        name: "MSM Dental Clinic",
        email: process.env.EMAIL_USER // MUST be verified in Brevo account
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

    console.log('[EMAIL] Sending to Brevo API...');
    console.log('[EMAIL] Payload:', JSON.stringify(emailData, null, 2));

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    process.stdout.write('[EMAIL] API Response Status: ' + response.status + ' ' + response.statusText + '\n');
    console.log('[EMAIL] Full response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      process.stdout.write('[EMAIL ERROR] ❌ Brevo API failed with status ' + response.status + '\n');
      console.error('[EMAIL ERROR] Response body:', errorData);
      throw new Error(`Brevo API error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    process.stdout.write('✅✅✅ [EMAIL SUCCESS] Email sent! MessageId: ' + result.messageId + ' ✅✅✅\n');
    console.log('[EMAIL SUCCESS] Email sent via Brevo API. MessageId:', result.messageId);
  } catch (error) {
    process.stdout.write('[EMAIL EXCEPTION] ❌ Error occurred: ' + error.message + '\n');
    console.error('[EMAIL EXCEPTION] Error occurred:');
    console.error('[EMAIL EXCEPTION] Message:', error.message);
    console.error('[EMAIL EXCEPTION] Stack:', error.stack);
    if (error && error.code) {
      console.error('[EMAIL EXCEPTION] Code:', error.code);
    }
    // Don't rethrow - email failure should not prevent appointment creation
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