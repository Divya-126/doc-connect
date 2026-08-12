# 🩺 Doc-Connect — Admin & Doctor Frontend

A modern, fully responsive Admin & Doctor frontend built to manage doctors, appointments, profiles, communication, and healthcare operations for the Doc-Connect platform.

Designed with a clean, professional interface, role-based access, secure authentication, real-time chat, and video consultation features to create a complete healthcare management experience.

---

## 🚀 Features

### 👨‍💼 Admin Features

- 🔐 Admin Login
- 📊 Admin Dashboard
- 👨‍⚕️ Add Doctor
- 📋 Doctors List
- 📅 View All Appointments
- 🔄 Change Doctor Availability
- 📝 Manage Doctor Information
- 🗑️ Delete Doctor Accounts
- 💾 Save Doctors as Drafts
- 📤 Manage & Publish Draft Doctors
- 🔒 Protected Admin Pages

### 👨‍⚕️ Doctor Features

- 🔐 Doctor Login
- 📊 Doctor Dashboard
- 📅 View Doctor Appointments
- ✅ Complete Appointments
- ❌ Cancel Appointments
- 👤 View & Update Doctor Profile
- 💬 Doctor-Patient Chat
- 📹 Video Consultation
- 📞 Online Calls
- 🔒 Protected Doctor Pages
- 🔑 Password Recovery

---

## 🧠 How It Works

- Admins can manage doctors, appointments, availability, and doctor information.
- Doctors can view and manage their appointments.
- Doctors can complete or cancel appointments.
- Doctors can view and update their professional profiles.
- Doctors and patients can communicate through real-time chat.
- Doctors can conduct online video consultations.
- Protected routes provide separate access for Admin and Doctor users.
- The application redirects authenticated users to the correct dashboard based on their role.
- Password recovery uses an OTP-based verification flow.
- Both Admin and Doctor interfaces communicate with the same shared backend.

---

## 🛠 Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios

### UI Libraries

- Lucide React
- React Toastify

### Communication

- Stream Chat
- Video / Call Integration

### Authentication

- JWT
- Role-Based Access Control
- OTP Password Recovery

### Deployment

- Vercel

---

## 📂 Project Structure

```text
admin
│
├── public
│
├── src
│ ├── assets
│ │
│ ├── components
│ │ ├── Layout.jsx
│ │ ├── MiniLayout.jsx
│ │ ├── Navbar.jsx
│ │ ├── Sidebar.jsx
│ │ ├── CallButton.jsx
│ │ └── ...
│ │
│ ├── context
│ │ ├── AdminContext.jsx
│ │ ├── AppContext.jsx
│ │ └── DocterContext.jsx
│ │
│ ├── pages
│ │ ├── Admin
│ │ │ ├── Dashboard.jsx
│ │ │ ├── AllAppointments.jsx
│ │ │ ├── AddDoctor.jsx
│ │ │ └── DoctorsList.jsx
│ │ │
│ │ ├── Doctor
│ │ │ ├── DoctorDashboard.jsx
│ │ │ ├── DoctorAppointments.jsx
│ │ │ ├── DoctorProfile.jsx
│ │ │ ├── ChatPage.jsx
│ │ │ └── CallPage.jsx
│ │ │
│ │ ├── Login.jsx
│ │ ├── ForgetPassword.jsx
│ │ ├── ResetPassword.jsx
│ │ └── ...
│ │
│ ├── App.jsx
│ └── main.jsx
│
├── .env
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md

```

---

## 🔐 Authentication

Doc-Connect uses separate authentication tokens for Admin and Doctor users.

### 👨‍💼 Admin Authentication

Admin Login
↓
/api/admin/login
↓
aToken
↓
/admin-dashboard

### 👨‍⚕️ Doctor Authentication

Doctor Login
↓
/api/doctor/login
↓
dToken
↓
/doctor-dashboard

### 🔑 Password Recovery

Enter Email
↓
Send OTP
↓
Verify OTP
↓
Create New Password
↓
Password Changed
↓
Login

## 🔗 Backend Integration

The Admin & Doctor frontend communicates with the shared Doc-Connect backend.

API Routes

/api/admin → Admin APIs
/api/doctor → Doctor APIs
/api/chat → Chat / Streaming APIs
/api/user → Patient APIs

## Platform Architecture

                     🩺 DOC-CONNECT
                           │
             ┌─────────────┴─────────────┐
             │                           │
      👤 Patient Frontend        👨‍💼 Admin + Doctor
             │                           │
             └─────────────┬─────────────┘
                           │
                           ▼
                    🔗 Shared Backend
                           │
                           ▼
                       🗄️ Database

## ⚙ Installation

Clone the repository

git clone https://github.com/yourusername/doc-connect.git

Go to the admin directory

cd admin

Install dependencies

npm install

Create a .env file in the admin folder

VITE_BACKEND_URL=http://localhost:4000

Start the development server

npm run dev

Create a production build

npm run build

Preview the production build

npm run preview

## 🌐 Environment Variables

Create a .env file in the admin project root and add:

Local Development

VITE_BACKEND_URL=http://localhost:4000

Production

VITE_BACKEND_URL=https://doc-connect-backend.onrender.com

⚠️ Never commit .env files or sensitive credentials to GitHub.

📸 Screenshots

👨‍💼 Admin Dashboard

(Add Screenshot)

👨‍⚕️ Doctor Dashboard

(Add Screenshot)

👨‍⚕️ Doctors List

(Add Screenshot)

📅 Appointments

(Add Screenshot)

💬 Doctor-Patient Chat

(Add Screenshot)

📹 Video Consultation

(Add Screenshot)

☁️ Deployment

Doc-Connect uses separate frontend applications connected to a shared backend.

## Recommended Deployment

👤 Patient Frontend
│
│ Vercel
▼

👨‍💼 Admin + Doctor Frontend
│
│ Vercel
▼

⚙️ Backend API
│
│ Render
▼

🗄️ Database

Production Structure

Patient Frontend
https://your-patient-app.vercel.app

Admin + Doctor Frontend
https://your-admin-app.vercel.app

Backend API
https://doc-connect-backend.onrender.com

## 🛡️ Security

🔐 JWT-based authentication

🔒 Protected Admin routes

🔒 Protected Doctor routes

👥 Role-based access control

🔑 OTP-based password recovery

🚫 Environment variables for configuration

🔐 Sensitive credentials kept on the backend

### Security Rules

❌ Never commit .env files
❌ Never expose backend secrets
❌ Never store private third-party credentials in frontend code

✅ Use VITE_BACKEND_URL for API configuration
✅ Keep sensitive credentials on the backend
✅ Protect role-specific routes

✨ Future Improvements

📊 Advanced Admin Analytics

🔔 Real-time Appointment Notifications

📩 Email & SMS Notifications

📅 Advanced Doctor Scheduling

🧑‍⚕️ Doctor Availability Calendar

💬 Enhanced Real-time Chat Features

📹 Improved Video Consultation Features

📈 Advanced Appointment Reports

🔍 Advanced Search & Filtering

🌐 Multi-language Support

## 👨‍💻 Author

### Divya Dhote

B.Tech — Computer Science & Engineering

Full Stack Developer passionate about building modern, scalable, and user-friendly web applications.

💼 LinkedIn

🐙 GitHub

📧 Email

⭐ Support

If you like this project, please consider giving it a ⭐ on GitHub.

It motivates me to keep building and improving modern full-stack applications.

❤️ Thank you for visiting Doc-Connect!

Doc-Connect — Connecting Patients, Doctors & Healthcare Management.
