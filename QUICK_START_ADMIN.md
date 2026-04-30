# 🚀 Quick Start Guide

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB running locally or MongoDB Atlas connection
- npm or yarn package manager

### Step 1: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies (if not already done)
npm install

# Start backend server
npm start
# Backend runs on http://localhost:5000
```

### Step 2: Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (if not already done)
npm install

# Start React development server
npm start
# Frontend opens on http://localhost:3000
```

### Step 3: Access Admin Dashboard

1. Open browser and go to: **http://localhost:3000/admin**
2. Enter password: **admin123**
3. Click "🔐 Login"

---

## ✨ Key Features Overview

### Dashboard Stats (Top Cards)
Shows real-time statistics:
- 🔵 **Total Appointments** - All time
- 🟢 **Today's Appointments** - Only today
- 🟡 **Pending Appointments** - Status = Pending
- 🟣 **Completed Appointments** - Status = Completed

### Search & Filters (Filter Panel)
1. **Search Box**: Type patient name or phone number
2. **Status Dropdown**: Filter by appointment status
3. **Date Range**: Today / This Week / Custom
4. **Records Per Page**: 5, 10, 15, 20, or 50
5. **Apply Filters** Button: Execute filter
6. **Clear All** Button: Reset all filters

### Appointments Table
Shows appointment details with:
- Patient Name
- Phone Number (clickable tel: link)
- Email (clickable mailto: link)
- Appointment Date
- Status (color-coded dropdown)
- Message Preview
- Quick Action Buttons

### Quick Action Buttons (Per Row)
- 📞 **Call**: Click to dial patient
- 💬 **WhatsApp**: Send WhatsApp message
- 📝 **Notes**: Add/edit internal notes
- 🗑️ **Delete**: Remove appointment

### Pagination
- **Previous/Next** buttons for navigation
- **Page indicator**: Shows current page and total pages
- Auto-adjusts based on records per page setting

---

## 🎯 Common Tasks

### Find Specific Appointment
```
1. Type patient name in "Search (Name/Phone)" box
2. Click "Apply Filters"
3. Appointment will appear in table
```

### Change Appointment Status
```
1. Find appointment in table
2. Click status dropdown (Pending/Confirmed/Completed/Cancelled)
3. Status updates immediately
4. Dashboard stats auto-refresh
```

### Add Notes to Appointment
```
1. Find appointment in table
2. Click "📝" (Notes) button
3. Type notes in modal
4. Click "✅ Save"
5. Notes are saved to database
```

### Call Patient
```
1. Find appointment in table
2. Click "📞" (Call) button
3. Phone dialer opens with patient's number
4. Click to call
```

### Message on WhatsApp
```
1. Find appointment in table
2. Click "💬" (WhatsApp) button
3. WhatsApp opens with prefilled message
4. Send message to patient
```

### Export to CSV
```
1. (Optional) Apply filters to export specific appointments
2. Click "📥 Export CSV" button
3. File downloads to your computer
4. Open with Excel or Google Sheets
```

### Delete Appointment
```
1. Find appointment in table
2. Click "🗑️" (Delete) button
3. Confirm deletion when prompted
4. Appointment is removed
```

---

## 🔄 Filter Examples

### Today's Appointments Only
```
1. Date Range: Select "Today"
2. Click "Apply Filters"
```

### This Week's Appointments
```
1. Date Range: Select "This Week"
2. Click "Apply Filters"
```

### Custom Date Range
```
1. Date Range: Select "Custom Range"
2. Start Date: Pick date
3. End Date: Pick date
4. Click "Apply Filters"
```

### All Pending Appointments
```
1. Status: Select "Pending"
2. Click "Apply Filters"
```

### Search by Name
```
1. Search Box: Type "John"
2. Click "Apply Filters"
3. Shows all appointments with John in name
```

### Search by Phone
```
1. Search Box: Type "123456"
2. Click "Apply Filters"
3. Shows appointment with that phone number
```

### Combine Multiple Filters
```
1. Search Box: Type name
2. Status: Select "Confirmed"
3. Date Range: Select "This Week"
4. Click "Apply Filters"
5. Shows matching appointments
```

---

## 💾 Database Fields

Each appointment now stores:
```json
{
  "_id": "MongoDB ID",
  "name": "Patient Name",
  "phone": "Phone Number",
  "email": "Email Address",
  "date": "Appointment Date & Time",
  "message": "Patient Message/Reason",
  "status": "Pending|Confirmed|Completed|Cancelled",
  "notes": "Admin Internal Notes",
  "createdAt": "Creation Timestamp",
  "updatedAt": "Last Update Timestamp"
}
```

---

## 🎨 Status Colors

| Status | Color | Usage |
|--------|-------|-------|
| Pending | 🟡 Yellow | New appointments awaiting confirmation |
| Confirmed | 🔵 Blue | Patient confirmed appointment |
| Completed | 🟢 Green | Appointment completed |
| Cancelled | 🔴 Red | Appointment cancelled |

---

## ⚙️ Configuration

### Change Admin Password
**File**: `frontend/src/components/Admin.js`
**Line**: Search for `password === 'admin123'`
**Change**: Replace `'admin123'` with desired password

### Change Records Per Page Default
**File**: `frontend/src/components/Admin.js`
**Line**: Search for `const [limit, setLimit] = useState(10);`
**Change**: Replace `10` with preferred number

### Change Backend API URL
**File**: `frontend/src/components/Admin.js`
**Search**: `http://localhost:5000/api`
**Replace**: With your production/staging URL

---

## 🔍 Monitor Dashboard

### Real-time Updates
- Stats update when appointments are added/deleted/status changed
- Table refreshes automatically
- No page reload needed

### Manual Refresh
- Click "🔄 Refresh" button to manually refresh all data
- Or apply filters to refresh with filters

---

## 📊 Pagination Behavior

If you have 65 appointments and set limit to 10:
- Page 1: Shows appointments 1-10
- Page 2: Shows appointments 11-20
- Page 3: Shows appointments 21-30
- Page 4: Shows appointments 31-40
- Page 5: Shows appointments 41-50
- Page 6: Shows appointments 51-60
- Page 7: Shows appointments 61-65

---

## 🌙 Dark Mode
The dashboard automatically adapts to your system's dark/light mode preference. All features work identically in both modes.

---

## 📱 Mobile Access
- ✅ Full functionality on mobile
- ✅ Responsive design adapts to screen size
- ✅ All buttons and features accessible
- ✅ Touch-friendly interface

---

## ⚠️ Important Notes

1. **Admin Password**: Change from `admin123` in production
2. **Keep Backend Running**: Backend must be active for dashboard to work
3. **Database Connection**: MongoDB must be connected for data persistence
4. **CSV Export**: Uses current filtered view (not all data)
5. **WhatsApp Link**: Requires phone number in valid format
6. **Notes are Private**: Not shared with patients

---

## 🆘 Troubleshooting

### Dashboard Won't Load
```
❌ Problem: Blank page
✅ Solution: 
1. Check if backend is running (npm start in backend folder)
2. Check if MongoDB is connected
3. Clear browser cache (Ctrl+Shift+Delete)
4. Hard refresh browser (Ctrl+Shift+R)
```

### Can't Login
```
❌ Problem: "Invalid password" message
✅ Solution:
1. Check if password matches (default: admin123)
2. Check backend error logs
3. Verify MongoDB connection
```

### Filters Not Working
```
❌ Problem: Filter applied but no results
✅ Solution:
1. Click "Clear All" to reset filters
2. Check if data exists in database
3. Try refreshing data with "🔄 Refresh" button
```

### WhatsApp Not Opening
```
❌ Problem: WhatsApp icon doesn't work
✅ Solution:
1. Ensure phone number is valid (digits only)
2. Use international format if needed
3. Install WhatsApp on device
```

### Export CSV Not Working
```
❌ Problem: File doesn't download
✅ Solution:
1. Check browser download settings
2. Ensure you have at least 1 appointment to export
3. Check browser console for errors (F12)
```

---

## 📞 Quick Support Checklist

If something doesn't work, verify:
- [ ] Backend server is running on port 5000
- [ ] MongoDB is connected and running
- [ ] Frontend server is running on port 3000
- [ ] You're using correct admin password
- [ ] Browser console shows no errors (F12)
- [ ] No network errors in Network tab (F12)
- [ ] Correct API endpoints in Admin.js file

---

## 🎓 Next Steps

1. ✅ Test all features on development
2. ✅ Train staff on how to use dashboard
3. ✅ Change admin password
4. ✅ Set up production database
5. ✅ Configure production API endpoints
6. ✅ Set up automated backups
7. ✅ Monitor logs and performance

