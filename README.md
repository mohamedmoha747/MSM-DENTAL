# Dental Clinic Management Website

A full-stack MERN (MongoDB, Express.js, React, Node.js) dental clinic management website.

## Features

- Responsive React frontend with Tailwind CSS
- Appointment booking system
- Admin panel for managing appointments
- Doctor profiles
- Service listings
- Contact information with maps
- Testimonials

## Project Structure

```
moon-product/
├── frontend/          # React app
│   ├── src/
│   │   ├── components/
│   │   └── ...
├── backend/           # Node.js/Express server
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with:
   ```
   MONGO_URI=mongodb://localhost:27017/dental_clinic
   PORT=5000
   ```

4. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The frontend will run on `http://localhost:3000` and backend on `http://localhost:5000`.

### Admin Access

- Go to `/admin` route
- Password: `admin123`

## Technologies Used

- **Frontend:** React, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Styling:** Tailwind CSS

## API Endpoints

- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get all appointments (admin)
- `DELETE /api/appointments/:id` - Delete appointment

## Deployment

For production deployment, build the frontend and serve static files from the backend.

1. Build frontend:
   ```
   cd frontend && npm run build
   ```

2. Serve static files in backend (update server.js accordingly).

3. Set environment variables for production MongoDB URI.