import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
  verifyEmail,
  resendOtp,
  getAppointment,

  // Forgot password
  forgotPassword,
  verifyResetPasswordOtp,
  resendResetPasswordOtp,
  resetPasswordByOtp,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

import upload from "../middlewares/multer.js";

const userRouter = express.Router();

// initial routes with no auth
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/resend-otp", resendOtp);

// all auth routes
userRouter.get("/get-profile", authUser, getProfile);
userRouter.get("/get-appointment/:appId", authUser, getAppointment);
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile,
);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/payment-razorpay", authUser, paymentRazorpay);
userRouter.post("/verifyRazorpay", authUser, verifyRazorpay);

// forget password

userRouter.post("/forgot-password", forgotPassword);

userRouter.post("/verify-reset-otp", verifyResetPasswordOtp);

userRouter.post("/resend-reset-otp", resendResetPasswordOtp);

userRouter.post("/change-password", resetPasswordByOtp);

export default userRouter;
