# 🩺 Doc-Connect

A modern **Doctor Appointment Booking System** built with the **MERN Stack**.

Doc-Connect connects **patients, doctors, and administrators** through a secure and easy-to-use platform for managing appointments, doctor availability, payments, reminders, and online consultations.

---

## ✨ Features

### 👨‍⚕️ Patient

- 🔐 Secure registration and login
- 🔎 Search and filter doctors
- 👨‍⚕️ View doctor profiles and availability
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
- ✅ Accept/manage appointments
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

> **Auto-updating folder structure:**
> The structure below is intended to be generated from the actual project directories so it stays synchronized when folders/files are added or removed.

```text
Doc-Connect/
│
├── frontend/
│   ├── public/
│   │
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── admin/
│   ├── public/
│   │
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

### 🔄 Generate Folder Structure Automatically

Instead of manually updating the structure every time your project changes, generate it from the filesystem.

Create a script such as:

```text
scripts/
└── generate-tree.js
```

Example:

```js
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const ignored = new Set(["node_modules", ".git", "dist", "build", ".env"]);

function generateTree(dir, prefix = "") {
  const items = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((item) => !ignored.has(item.name))
    .sort((a, b) => {
      if (a.isDirectory() !== b.isDirectory()) {
        return a.isDirectory() ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });

  let output = "";

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const connector = isLast ? "└── " : "├── ";

    output += `${prefix}${connector}${item.name}\n`;

    if (item.isDirectory()) {
      const nextPrefix = prefix + (isLast ? "    " : "│   ");
      output += generateTree(path.join(dir, item.name), nextPrefix);
    }
  });

  return output;
}

const tree = `Doc-Connect/\n${generateTree(root)}`;

fs.writeFileSync(path.join(root, "PROJECT_STRUCTURE.txt"), tree);

console.log("✅ Project structure updated!");
```

Run:

```bash
node scripts/generate-tree.js
```

This creates:

```text
PROJECT_STRUCTURE.txt
```

with the **current actual folder/file structure**.

---

## 🔐 Authentication

Doc-Connect uses **JWT-based authentication**.

Passwords are securely hashed using **BCrypt** before being stored in the database.

Authentication flow:

```text
User
  ↓
Login / Register
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
7. Join an online consultation when applicable

The system also prevents conflicting bookings and manages booked slots.

---

## ⏰ Appointment Reminders

Doc-Connect uses **Node-Cron** to schedule appointment reminders.

Reminders can be scheduled:

- 📅 1 day before appointment
- ⏰ 1 hour before appointment

---

## 💳 Payment System

**Razorpay** is integrated for secure online appointment payments.

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

Example backend:

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

> Never commit `.env` files to GitHub.

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

## 🔄 Auto-Updating Project Structure

To keep the README synchronized with your actual project, you can use a generated marker:

```md
<!-- PROJECT_STRUCTURE_START -->

<!-- PROJECT_STRUCTURE_END -->
```

Then use a script to replace everything between these markers with the latest generated structure.

Recommended workflow:

```text
Code Changes
     ↓
Create / Delete Files
     ↓
Run Structure Generator
     ↓
README.md Updated
     ↓
Commit Changes
```

This prevents the README from becoming outdated as Doc-Connect grows.

---

## 📊 Project Architecture

```text
                    ┌───────────────────┐
                    │     Patients      │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ React Frontend    │
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
