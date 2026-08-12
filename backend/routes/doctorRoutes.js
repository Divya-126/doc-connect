import express from "express";

import {
  appointmentCancelDoc,
  appointmentComplete,
  appointmentsDoctor,
  changeAvailability,
  doctorDashboard,
  doctorList,
  doctorProfile,
  getAppointment,
  loginDoctor,
  forgotPassword,
  updateDoctorProfile,

  // Password reset OTP
  verifyResetPasswordOtp,
  resendResetPasswordOtp,
  resetPasswordByOtp,
} from "../controllers/doctorController.js";

import authDoctor from "../middlewares/authDoctor.js";
import upload from "../middlewares/multer.js";

const doctorRouter = express.Router();

// ======================================================
// DOCTOR LOGIN
// ======================================================

doctorRouter.post("/login", loginDoctor);

// ======================================================
// PASSWORD RESET - SEND OTP
// ======================================================

doctorRouter.post("/forgot-password", forgotPassword);

// ======================================================
// PASSWORD RESET - VERIFY OTP
// ======================================================

doctorRouter.post("/verify-reset-otp", verifyResetPasswordOtp);

// ======================================================
// PASSWORD RESET - RESEND OTP
// ======================================================

doctorRouter.post("/resend-reset-otp", resendResetPasswordOtp);

// ======================================================
// PASSWORD RESET - CHANGE PASSWORD
// IMPORTANT: DO NOT USE authDoctor HERE
// ======================================================

doctorRouter.post("/change-password", resetPasswordByOtp);

// ======================================================
// PROTECTED DOCTOR ROUTES
// ======================================================

doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancelDoc);

doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);

doctorRouter.get("/list", doctorList);

doctorRouter.post("/change-availability", authDoctor, changeAvailability);

doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);

doctorRouter.get("/dashboard", authDoctor, doctorDashboard);

doctorRouter.get("/profile", authDoctor, doctorProfile);

doctorRouter.get("/get-appointment", authDoctor, getAppointment);

doctorRouter.post(
  "/update-profile",
  authDoctor,
  upload.single("image"),
  updateDoctorProfile,
);

export default doctorRouter;
