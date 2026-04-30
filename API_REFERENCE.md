# 📚 API Reference Guide

## Base URL
```
http://localhost:5000/api
```

---

## 📋 Appointment Endpoints

### 1. Get All Appointments (with filters & pagination)

**Endpoint**: `GET /appointments`

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number for pagination |
| limit | number | No | 10 | Number of records per page |
| search | string | No | - | Search in name or phone |
| status | string | No | - | Filter by status |
| startDate | date | No | - | Filter from date (YYYY-MM-DD) |
| endDate | date | No | - | Filter to date (YYYY-MM-DD) |

**Example Requests**:

Get page 1 with 10 records:
```http
GET /appointments?page=1&limit=10
```

Search for "John":
```http
GET /appointments?search=John
```

Get pending appointments:
```http
GET /appointments?status=Pending
```

Get appointments from Jan 15 to Jan 31, 2024:
```http
GET /appointments?startDate=2024-01-15&endDate=2024-01-31
```

Complex filter - John's confirmed appointments this week:
```http
GET /appointments?search=John&status=Confirmed&startDate=2024-01-15&endDate=2024-01-21
```

**Success Response (200)**: 
```json
{
  "appointments": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "phone": "+1234567890",
      "email": "john@example.com",
      "date": "2024-01-15T10:30:00Z",
      "message": "Regular checkup needed",
      "status": "Confirmed",
      "notes": "Patient has sensitive teeth",
      "createdAt": "2024-01-10T08:00:00Z",
      "updatedAt": "2024-01-11T15:30:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "phone": "+0987654321",
      "email": "jane@example.com",
      "date": "2024-01-15T14:00:00Z",
      "message": "Tooth extraction",
      "status": "Pending",
      "notes": "Pre-op consultation completed",
      "createdAt": "2024-01-12T10:00:00Z",
      "updatedAt": "2024-01-12T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 47,
    "pages": 5,
    "currentPage": 1,
    "limit": 10
  }
}
```

**Error Response (500)**:
```json
{
  "message": "Error message details"
}
```

---

### 2. Get Dashboard Statistics

**Endpoint**: `GET /appointments/stats/dashboard`

**Description**: Returns summary statistics for dashboard cards

**Parameters**: None

**Example Request**:
```http
GET /appointments/stats/dashboard
```

**Success Response (200)**:
```json
{
  "totalAppointments": 156,
  "todayAppointments": 8,
  "pendingAppointments": 23,
  "completedAppointments": 112
}
```

**Statistics Breakdown**:
- `totalAppointments`: Count of all appointments in database
- `todayAppointments`: Appointments with date = today (00:00:00 to 23:59:59)
- `pendingAppointments`: Appointments with status = "Pending"
- `completedAppointments`: Appointments with status = "Completed"

---

### 3. Create New Appointment

**Endpoint**: `POST /appointments`

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "date": "2024-01-20T10:30:00Z",
  "message": "Regular checkup"
}
```

**Required Fields**: All fields are required
- `name`: Patient's full name (string)
- `phone`: Phone number (string)
- `email`: Valid email address (string)
- `date`: Appointment date and time (ISO 8601 format)
- `message`: Reason for appointment (string)

**Field Constraints**:
- `name`: Min 2 chars, Max 100 chars
- `phone`: Valid phone format
- `email`: Valid email format
- `date`: Must be valid ISO date
- `message`: Min 5 chars, Max 500 chars

**Example Requests**:

Using cURL:
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "date": "2024-01-20T10:30:00Z",
    "message": "Regular checkup needed"
  }'
```

Using Axios (JavaScript):
```javascript
axios.post('http://localhost:5000/api/appointments', {
  name: 'John Doe',
  phone: '+1234567890',
  email: 'john@example.com',
  date: '2024-01-20T10:30:00Z',
  message: 'Regular checkup needed'
})
.then(response => console.log(response.data))
.catch(error => console.error(error));
```

**Success Response (201)**:
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "date": "2024-01-20T10:30:00Z",
  "message": "Regular checkup needed",
  "status": "Pending",
  "notes": "",
  "createdAt": "2024-01-15T12:00:00Z",
  "updatedAt": "2024-01-15T12:00:00Z"
}
```

**Error Responses**:

Missing field (400):
```json
{
  "message": "All fields are required"
}
```

Server error (500):
```json
{
  "message": "Error message details"
}
```

---

### 4. Update Appointment Status

**Endpoint**: `PUT /appointments/:id/status`

**URL Parameters**:
- `id`: Appointment MongoDB ObjectId (required)

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "status": "Completed"
}
```

**Valid Status Values**:
- `Pending`: Initial/waiting status
- `Confirmed`: Patient confirmed
- `Completed`: Appointment finished
- `Cancelled`: Appointment cancelled

**Example Requests**:

Mark appointment as completed:
```http
PUT /appointments/507f1f77bcf86cd799439011/status
Content-Type: application/json

{
  "status": "Completed"
}
```

Using cURL:
```bash
curl -X PUT http://localhost:5000/api/appointments/507f1f77bcf86cd799439011/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Completed"}'
```

Using Axios:
```javascript
axios.put(
  'http://localhost:5000/api/appointments/507f1f77bcf86cd799439011/status',
  { status: 'Completed' }
)
.then(response => console.log(response.data))
.catch(error => console.error(error));
```

**Success Response (200)**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "date": "2024-01-15T10:30:00Z",
  "message": "Regular checkup needed",
  "status": "Completed",
  "notes": "Checkup completed successfully",
  "createdAt": "2024-01-10T08:00:00Z",
  "updatedAt": "2024-01-15T16:45:00Z"
}
```

**Error Responses**:

Invalid status (400):
```json
{
  "message": "Invalid status"
}
```

Appointment not found (404):
```json
{
  "message": "Appointment not found"
}
```

---

### 5. Update Appointment Notes

**Endpoint**: `PUT /appointments/:id/notes`

**URL Parameters**:
- `id`: Appointment MongoDB ObjectId (required)

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "notes": "Patient has severe tooth pain. Needs root canal treatment."
}
```

**Field Constraints**:
- `notes`: Optional, Max 1000 chars
- Can be empty string to clear notes

**Example Requests**:

Add/update notes:
```http
PUT /appointments/507f1f77bcf86cd799439011/notes
Content-Type: application/json

{
  "notes": "Patient has sensitive teeth. Use gentle approach."
}
```

Clear notes:
```http
PUT /appointments/507f1f77bcf86cd799439011/notes
Content-Type: application/json

{
  "notes": ""
}
```

Using Axios:
```javascript
axios.put(
  'http://localhost:5000/api/appointments/507f1f77bcf86cd799439011/notes',
  { notes: 'Patient has sensitive teeth. Use gentle approach.' }
)
.then(response => console.log(response.data))
.catch(error => console.error(error));
```

**Success Response (200)**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "date": "2024-01-15T10:30:00Z",
  "message": "Regular checkup needed",
  "status": "Confirmed",
  "notes": "Patient has sensitive teeth. Use gentle approach.",
  "createdAt": "2024-01-10T08:00:00Z",
  "updatedAt": "2024-01-15T17:20:00Z"
}
```

**Error Responses**:

Appointment not found (404):
```json
{
  "message": "Appointment not found"
}
```

---

### 6. Delete Appointment

**Endpoint**: `DELETE /appointments/:id`

**URL Parameters**:
- `id`: Appointment MongoDB ObjectId (required)

**Content-Type**: `application/json`

**Request Body**: Empty

**Example Requests**:

Delete appointment:
```http
DELETE /appointments/507f1f77bcf86cd799439011
```

Using cURL:
```bash
curl -X DELETE http://localhost:5000/api/appointments/507f1f77bcf86cd799439011
```

Using Axios:
```javascript
axios.delete('http://localhost:5000/api/appointments/507f1f77bcf86cd799439011')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

**Success Response (200)**:
```json
{
  "message": "Appointment deleted successfully"
}
```

**Error Responses**:

Appointment not found (404):
```json
{
  "message": "Appointment not found"
}
```

Server error (500):
```json
{
  "message": "Error message details"
}
```

---

## 🔍 Advanced Filtering Examples

### Example 1: Get Today's Completed Appointments
```http
GET /appointments?status=Completed&startDate=2024-01-15&endDate=2024-01-15&limit=50
```

**Response**: All appointments completed today

---

### Example 2: Search for "Johnson" in Last 30 Days
```javascript
const today = new Date();
const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

axios.get('http://localhost:5000/api/appointments', {
  params: {
    search: 'Johnson',
    startDate: thirtyDaysAgo.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
    limit: 50
  }
})
```

---

### Example 3: Paginate Through All Pending Appointments
```javascript
async function getAllPending() {
  let page = 1;
  let hasMore = true;
  const allAppointments = [];

  while (hasMore) {
    const response = await axios.get('http://localhost:5000/api/appointments', {
      params: {
        status: 'Pending',
        page: page,
        limit: 20
      }
    });

    allAppointments.push(...response.data.appointments);
    
    if (page >= response.data.pagination.pages) {
      hasMore = false;
    }
    page++;
  }

  return allAppointments;
}
```

---

### Example 4: Get Phone Number "9876543210" Across All Pages
```javascript
async function findByPhone(phone) {
  const response = await axios.get('http://localhost:5000/api/appointments', {
    params: {
      search: phone,
      limit: 50
    }
  });

  return response.data.appointments;
}
```

---

## 🔐 Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK - Successful GET/PUT/DELETE | Data retrieved/updated/deleted |
| 201 | Created - Successful POST | New appointment created |
| 400 | Bad Request - Invalid data | Missing required fields |
| 404 | Not Found - Resource doesn't exist | Appointment ID not found |
| 500 | Server Error | Database connection failed |

---

## 📊 Pagination Guide

When making paginated requests:

```http
GET /appointments?page=2&limit=10
```

Response includes:
```json
{
  "appointments": [...],
  "pagination": {
    "total": 156,        // Total records in database
    "pages": 16,         // Total pages (156/10 = 16)
    "currentPage": 2,    // Current page number
    "limit": 10          // Records per page
  }
}
```

**Calculation**:
- Records on page: Min(limit, total - (page-1)*limit)
- Next page exists: currentPage < pages
- Previous page exists: currentPage > 1

---

## ⏱️ Date Format

All dates use ISO 8601 format:
```
YYYY-MM-DDTHH:mm:ssZ
2024-01-15T10:30:00Z
```

For filters (without time):
```
YYYY-MM-DD
2024-01-15
```

---

## 🛠️ Integration Examples

### React Component Integration
```javascript
import axios from 'axios';
import { useState, useEffect } from 'react';

function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/appointments')
      .then(res => setAppointments(res.data.appointments))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {loading ? <p>Loading...</p> : (
        <ul>
          {appointments.map(apt => (
            <li key={apt._id}>{apt.name} - {apt.date}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

### Postman Collection

Import this Postman collection for easy testing:

```json
{
  "info": {
    "name": "Dental Clinic API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Appointments",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/appointments?page=1&limit=10"
      }
    },
    {
      "name": "Get Dashboard Stats",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/appointments/stats/dashboard"
      }
    },
    {
      "name": "Create Appointment",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/appointments",
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"John\", \"phone\": \"9876543210\", \"email\": \"john@example.com\", \"date\": \"2024-01-20T10:30:00Z\", \"message\": \"Checkup\"}"
        }
      }
    }
  ]
}
```

---

## 🔗 Base URL Configuration

**Development**:
```
http://localhost:5000/api
```

**Staging**:
```
https://staging-api.example.com/api
```

**Production**:
```
https://api.example.com/api
```

Change in frontend `Admin.js`:
```javascript
// Line containing: 'http://localhost:5000/api/appointments'
// Replace with your URL
```

