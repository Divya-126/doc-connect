# 🩺 Doc-Connect

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=3000&pause=1000&color=4F46E5&center=true&vCenter=true&width=700&lines=Welcome+to+Doc-Connect+%F0%9F%A9%BA;Doctor+Appointment+Booking+System;Built+with+MERN+Stack+%E2%9A%A1;Connecting+Patients+%26+Doctors+%F0%9F%91%A8%E2%80%8D%E2%9A%95%EF%B8%8F" alt="Doc-Connect Animated Introduction" />

<br />

<img src="https://capsule-render.vercel.app/api?type=waving&color=4F46E5&height=120&section=header&text=Doc-Connect&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=65" width="100%" />

### 🩺 A Smart & Secure Doctor Appointment Platform

**Book Appointments • Manage Doctors • Online Consultation • Secure Payments**

<br />

<a href="#-features">
  <img src="https://img.shields.io/badge/Features-4F46E5?style=for-the-badge" />
</a>
<a href="#-tech-stack">
  <img src="https://img.shields.io/badge/MERN-Stack-111827?style=for-the-badge" />
</a>
<a href="#-installation">
  <img src="https://img.shields.io/badge/Setup-22C55E?style=for-the-badge" />
</a>

</div>

---

## 🌟 About Doc-Connect

**Doc-Connect** is a full-stack doctor appointment booking platform designed to make healthcare scheduling simple, secure, and accessible.

It provides separate experiences for:

```text
👨‍⚕️ Doctors       👤 Patients       🛠️ Administrators
     │                  │                    │
     └──────────────────┼────────────────────┘
                        │
                        ▼
                 🩺 DOC-CONNECT
                        │
             ┌──────────┼──────────┐
             ▼          ▼          ▼
          Booking    Payments   Consultation
```

---

## ✨ What Makes Doc-Connect Special?

<div align="center">

| 🚀 Feature | 💡 Description                |
| :--------: | :---------------------------- |
|     📅     | **Smart Appointment Booking** |
|     👨‍⚕️     | **Doctor Management**         |
|     💳     | **Secure Online Payments**    |
|     🔔     | **Appointment Reminders**     |
|     🎥     | **Video Consultation**        |
|     🔐     | **JWT Authentication**        |
|     📊     | **Admin Dashboard**           |
|     ☁️     | **Cloud Image Storage**       |

</div>

---

## 🧑‍💻 Built With

<div align="center">

<img src="https://skillicons.dev/icons?i=react,vite,tailwind,nodejs,express,mongodb,js,git,github" />

</div>

<br />

<div align="center">

**React.js** • **Node.js** • **Express.js** • **MongoDB**
**Tailwind CSS** • **JWT** • **Cloudinary** • **Razorpay**

</div>

---

## 📁 Project Structure

<!-- PROJECT_STRUCTURE_START -->

```text
Doc-Connect/
│
├── frontend/
├── backend/
├── admin/
├── scripts/
├── .github/
├── README.md
└── package.json
```

<!-- PROJECT_STRUCTURE_END -->

> 🔄 This section is automatically updated by GitHub Actions whenever changes are pushed.

---

## 🚀 Core Workflow

```text
             👤 Patient
                 │
                 ▼
        🔎 Find Doctor
                 │
                 ▼
        📅 Select Time Slot
                 │
                 ▼
         💳 Make Payment
                 │
                 ▼
       ✅ Appointment Confirmed
                 │
                 ▼
          🔔 Reminder
                 │
                 ▼
        🎥 Video Consultation
                 │
                 ▼
             🩺 Doctor
```

---

## 📸 Project Preview

<div align="center">

### 👤 Patient Portal

_Add your screenshots here_

### 👨‍⚕️ Doctor Dashboard

_Add your screenshots here_

### 🛠️ Admin Dashboard

_Add your screenshots here_

</div>

---

## 👨‍💻 Developer

<div align="center">

### **DIVYA DHOTE**

**MERN Stack Developer**

Building modern web applications with
**React • Node.js • Express • MongoDB**

<br />

<img src="https://komarev.com/ghpvc/?username=YOUR_GITHUB_USERNAME&label=Profile%20Views&color=4F46E5&style=for-the-badge" />

</div>

---

<div align="center">

### ⭐ If you like Doc-Connect, consider giving it a star!

**Made with ❤️ by Divya Dhote**

</div>

---

## ✨ Features

### 👨‍⚕️ Patient

- 🔐 Secure registration and login
- 🔎 Search and filter doctors
- 👨‍⚕️ View doctor profiles
- 📅 Book appointments
- 💳 Online appointment payments
- 📋 View upcoming and previous appointments
- ❌ Cancel appointments
- 🔔 Appointment reminders
- 🎥 Online video consultation
- 👤 Manage profile

### 🩺 Doctor

- 🔐 Secure doctor authentication
- 📅 Manage availability
- 🕐 Manage working days and time slots
- 📋 View appointments
- ✅ Manage appointments
- ❌ Cancel appointments
- 👤 Manage doctor profile
- 🎥 Online consultations

### 🛠️ Admin

- 🔐 Admin authentication
- ➕ Add doctors
- ✏️ Manage doctor information
- 🔄 Change doctor availability
- 📋 Manage all appointments
- ❌ Cancel appointments
- 📊 Dashboard and statistics
- 👨‍⚕️ Manage doctors

---

## 🧰 Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- React Context API
- Axios
- React Toastify

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- BCrypt
- Node-Cron

### Integrations

- ☁️ Cloudinary — Image Storage
- 💳 Razorpay — Online Payments
- 🎥 Stream.io / WebRTC — Video Consultation
- 📧 Email/SMS — Appointment Notifications

---

## 📁 Project Structure

<!-- PROJECT_STRUCTURE_START -->

```text
Doc-Connect/
│
├── frontend/
├── admin/
├── backend/
├── scripts/
├── .github/
├── .gitignore
├── README.md
└── package.json
```

<!-- PROJECT_STRUCTURE_END -->

> 🔄 **The project structure above is automatically updated by GitHub Actions whenever changes are pushed to the repository.**

---

## 🔐 Authentication

Doc-Connect uses **JWT-based authentication** for secure user sessions.

Passwords are securely hashed using **BCrypt** before being stored in the database.

```text
User
  ↓
Register / Login
  ↓
Backend Authentication
  ↓
BCrypt Password Verification
  ↓
JWT Token
  ↓
Protected Routes
  ↓
Dashboard
```

---

## 📅 Appointment System

The appointment system allows patients to:

1. Select a doctor
2. Select an available date
3. Select an available time slot
4. Confirm the appointment
5. Complete payment
6. Receive confirmation
7. Join an online consultation when available

The system also manages booked slots and helps prevent appointment conflicts.

---

## ⏰ Appointment Reminders

Doc-Connect uses **Node-Cron** to schedule appointment reminders.

Reminders can be scheduled:

- 📅 1 day before the appointment
- ⏰ 1 hour before the appointment

---

## 💳 Payment System

**Razorpay** is integrated for online appointment payments.

```text
Patient
   ↓
Select Appointment
   ↓
Payment
   ↓
Razorpay
   ↓
Payment Verification
   ↓
Appointment Confirmation
```

---

## 🎥 Video Consultation

Doc-Connect supports online doctor-patient consultations using video communication technologies.

```text
Patient
     ↘
       Video Consultation
     ↗
Doctor
```

---

## 🗄️ Database

Doc-Connect uses **MongoDB Atlas** with **Mongoose**.

Main entities include:

```text
User
Doctor
Appointment
```

Doctor information can include:

```text
name
email
password
image
speciality
degree
experience
about
fees
available
slots_booked
address
workingDays
```

---

## 🔒 Security

- JWT authentication
- BCrypt password hashing
- Protected API routes
- Role-based access
- Environment variables for secrets
- Secure payment verification
- Backend validation

---

## ⚙️ Environment Variables

Create `.env` files for sensitive configuration.

### Backend `.env`

```env
PORT=4000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

> ⚠️ Never commit `.env` files to GitHub.

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-username/doc-connect.git
```

### 2. Open Project

```bash
cd Doc-Connect
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 5. Install Admin Dependencies

```bash
cd ../admin
npm install
```

---

## ▶️ Run Project

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

### Admin Panel

```bash
cd admin
npm run dev
```

---

## 🔄 Automatic README Structure Updates

The project uses **GitHub Actions** to automatically keep the folder structure synchronized.

Workflow file:

```text
.github/
└── workflows/
    └── update-readme.yml
```

Whenever you push changes:

```text
Code Changes
      ↓
git push
      ↓
GitHub Actions
      ↓
Reads Current Project Structure
      ↓
Updates README.md
      ↓
Commits README.md
      ↓
README Updated Automatically ✅
```

You don't need to manually update the Project Structure section.

---

## 📊 Project Architecture

```text
                    ┌───────────────────┐
                    │     Patients      │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │  React Frontend   │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ Express / Node.js │
                    └───────┬─┬─┬───────┘
                            │ │ │
             ┌──────────────┘ │ └──────────────┐
             ▼                ▼                ▼
        MongoDB Atlas      Razorpay       Cloudinary
             │
             ▼
       Appointment Data
             │
             ▼
       Doctors / Patients
```

---

## 📌 Future Improvements

- [ ] Real-time chat between doctor and patient
- [ ] Advanced doctor search
- [ ] Prescription management
- [ ] Medical reports
- [ ] Push notifications
- [ ] Doctor analytics
- [ ] Patient health history
- [ ] Improved video consultation
- [ ] Automated deployment

---

## 👨‍💻 Developer

### **Divya Dhote**

**MERN Stack Developer**

Built with ❤️ using the MERN Stack.

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

**Doc-Connect — Connecting Patients with Better Healthcare.**
