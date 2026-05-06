# Email Sending Debug & Verification Checklist

## Issues Fixed

### 1. ✅ Environment Configuration
**Problem**: `EMAIL_PASS` was commented out in .env, causing environment validation to fail
- **Fix**: Removed the EMAIL_PASS check since we're using Brevo API, not SMTP
- **Status**: Updated `emailService.js` to only check for `BREVO_API_KEY` and `EMAIL_USER`

### 2. ✅ Sender Email Verification  
**Problem**: The sender email `aa0aa1001@smtp-brevo.com` must be verified in your Brevo account
- **Critical**: This is the most likely cause of email failure
- **Action Required**: See "Verification Steps" below

### 3. ✅ Error Logging
**Problem**: Errors were not being properly logged, making debugging impossible
- **Fix**: Added comprehensive logging with:
  - Full API response body on error
  - API status codes
  - Request payload logging
  - Exception details with stack trace
- **Benefit**: Server logs will now show exact reason for Brevo API rejection

### 4. ✅ Promise Error Handling
**Problem**: `sendAppointmentConfirmation()` was called without `.catch()`, silently swallowing errors
- **Fix**: Added `.catch()` handlers to log any errors that occur during email sending
- **Status**: Errors will now be visible in server logs

---

## Verification Steps

### Step 1: Verify Sender Email in Brevo
1. Log in to your Brevo account at https://app.brevo.com
2. Go to **Senders & Contacts** → **Senders**
3. Check if `aa0aa1001@smtp-brevo.com` is listed and **verified**
4. If not verified or missing:
   - Add your actual domain email (e.g., `noreply@yourdomain.com`)
   - Verify it following Brevo's process
   - Update `EMAIL_USER` in `.env` file

### Step 2: Test the Brevo API Key
Run this curl command in terminal to test if your API key works:

```bash
curl --location 'https://api.brevo.com/v3/smtp/email' \
--header 'accept: application/json' \
--header 'api-key: YOUR_BREVO_API_KEY_HERE' \
--header 'content-type: application/json' \
--data '{
  "sender": {
    "name": "MSM Dental Clinic",
    "email": "mohamedharun922@gmail.com"
  },
  "to": [{
    "email": "your-test-email@gmail.com",
    "name": "Test User"
  }],
  "subject": "Test Email",
  "htmlContent": "<p>This is a test email</p>"
}'
```

Expected success response:
```json
{
  "messageId": "<some-message-id>"
}
```

### Step 3: Monitor Server Logs
After making an appointment, check your server logs for these patterns:

**If successful:**
```
[EMAIL] Function called for: customer@email.com
[EMAIL] Sender email: aa0aa1001@smtp-brevo.com
[EMAIL] Recipient: customer@email.com
[EMAIL] Sending to Brevo API...
[EMAIL] API Response Status: 201 Created
[EMAIL SUCCESS] Email sent via Brevo API. MessageId: <message-id>
```

**If failed:**
```
[EMAIL ERROR] Brevo API failed with status 400
[EMAIL ERROR] Response body: {"code":"duplicate_parameter","message":"..."}
```

---

## Common Brevo API Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| **400 Bad Request** | Invalid email format or unverified sender | Verify sender email in Brevo dashboard |
| **401 Unauthorized** | Invalid API key | Check BREVO_API_KEY in .env file |
| **403 Forbidden** | API key has insufficient permissions | Regenerate API key with "Send transactional email" permission |
| **429 Too Many Requests** | Rate limit exceeded | Check Brevo account usage/plan limits |
| **500 Internal Server Error** | Brevo API issue | Retry after a few minutes, or check Brevo status page |

---

## Files Modified

1. **backend/.env**
   - Cleaned up commented lines
   - Added verification note for EMAIL_USER

2. **backend/utils/emailService.js**
   - Removed EMAIL_PASS dependency
   - Added comprehensive error logging
   - Improved initialization logs

3. **backend/controllers/appointmentController.js**
   - Added .catch() handlers for email sending
   - Improved log messages with prefixes

---

## Next Steps

1. **Verify your sender email** in Brevo account (CRITICAL)
2. **Update EMAIL_USER in .env** if needed
3. **Test with the curl command** above
4. **Create a test appointment** and check server logs
5. **If still failing**, share the exact error from logs in [EMAIL ERROR] section

---

## Additional Notes

- Email sending happens in the background (non-blocking)
- Appointment is saved even if email fails
- WhatsApp notifications use the same pattern (separate debug available if needed)
- All logs are prefixed with `[EMAIL]`, `[EMAIL ERROR]`, `[EMAIL SUCCESS]` for easy filtering
