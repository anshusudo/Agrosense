# AgroSense

AgroSense is a full-stack agricultural assistant for managing farm data and making data-informed crop decisions. It combines weather information, crop recommendations, AI-assisted crop analysis, farm management, reporting, and role-based administration in a single web application.

## Features

- User registration, login, OTP verification, and password recovery
- JWT-protected API access
- Farm and crop record management
- Weather data integration
- Crop and fertilizer recommendations
- AI chatbot assistance
- Crop image analysis through the Crop Copilot workflow
- PDF report generation and email delivery
- Admin dashboard and administrative controls
- English and Hindi language support
- Light and dark theme support
- Request rate limiting and request ID logging

## Technology Stack

### Frontend

- React 19
- React Router
- Axios
- Create React App
- Testing Library

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- JSON Web Tokens for authentication
- Multer for image uploads
- Groq SDK for AI features
- Nodemailer and SendGrid integrations for email
- PDFKit for report generation

## Project Structure

```text
Agrosense/
|-- backend/
|   |-- controllers/       Request handlers
|   |-- middleware/        Authentication, authorization, uploads, and limits
|   |-- models/            MongoDB models
|   |-- routes/            API route definitions
|   |-- scripts/           Administrative scripts
|   |-- services/          Business logic and external integrations
|   |-- server.js          Express application entry point
|   `-- .env.example       Backend environment template
`-- frontend/
	|-- public/            Static assets
	`-- src/
		|-- components/    Shared interface components
		|-- context/       Theme and language providers
		|-- pages/         Application pages
		`-- services/      API client configuration
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB connection string
- API credentials for the integrations you plan to use

## Installation

Clone the repository and install dependencies for both applications:

```bash
git clone https://github.com/anshusudo/Agrosense.git
cd Agrosense

cd backend
npm install

cd ../frontend
npm install
```

## Environment Configuration

Create `backend/.env` from the provided template:

```bash
cd backend
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Set the required backend values in `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/agrosense
JWT_SECRET=replace_with_a_strong_secret_key
```

Add the credentials required by the enabled features:

```env
WEATHER_API_KEY=your_openweather_api_key
GROQ_API_KEY=your_groq_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
EMAIL_FROM=your_email@gmail.com
```

Optional settings include `FRONTEND_URL`, `SENDGRID_API_KEY`, and `RUN_STARTUP_EMAIL_TEST`. Never commit `.env` or production credentials.

For the frontend, the API defaults to `http://localhost:5000`. To use another backend URL, create `frontend/.env` with:

```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

## Running Locally

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm start
```

The frontend is available at `http://localhost:3000` and the backend is available at `http://localhost:5000`.

## Available Scripts

### Backend

```bash
npm start       # Start the production server
npm run dev     # Start the server with Nodemon
npm run make-admin
```

### Frontend

```bash
npm start       # Start the development server
npm run build   # Create a production build
npm test        # Run the test suite
```

## API Overview

The backend exposes the following route groups:

| Route | Purpose |
| --- | --- |
| `/api/auth` | Registration, login, OTP, password recovery, and current user |
| `/api/farms` | Farm data management |
| `/api/weather` | Weather data |
| `/api/recommendations` | Crop and farming recommendations |
| `/api/chatbot` | AI chatbot interactions |
| `/api/crop-copilot` | Crop image analysis |
| `/api/admin` | Administrative operations |
| `/api/reports` | Report generation and delivery |
| `/api/test` | Development email testing routes |

Protected routes require a JWT in the `Authorization` header:

```text
Authorization: Bearer <token>
```

## Security Notes

- Use a long, unique `JWT_SECRET` outside development.
- Keep API keys, email credentials, and database credentials in environment variables.
- Restrict `FRONTEND_URL` to trusted frontend origins in production.
- Disable `RUN_STARTUP_EMAIL_TEST` unless email integration is being tested deliberately.
- Review upload and email configuration before deploying publicly.
