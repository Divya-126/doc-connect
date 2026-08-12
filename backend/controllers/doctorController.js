import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

import { sendPasswordResetOtp, sendDoctorAccount } from "./email/email.js";

import { upsertStreamUser } from "../lib/stream.js";

// ======================================================
// DOCTOR LOGIN
// ======================================================

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const doctor = await doctorModel.findOne({
      email: cleanEmail,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    const token = jwt.sign(
      {
        id: doctor._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Doctor login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// FORGOT PASSWORD - SEND OTP
// ======================================================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const cleanEmail = email?.trim().toLowerCase();

    console.log("====================================");
    console.log("FORGOT PASSWORD");
    console.log("Email:", cleanEmail);

    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const doctor = await doctorModel.findOne({
      email: cleanEmail,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor with this email does not exist",
      });
    }

    // Generate 6 digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    console.log("OTP generated:", otp);

    // Hash OTP before saving
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    /*
      IMPORTANT

      Keep OTP validity same everywhere.
      Here it is 2 minutes.
    */
    const otpExpire = Date.now() + 2 * 60 * 1000;

    // Save OTP
    doctor.resetPasswordOtp = hashedOtp;
    doctor.resetPasswordOtpExpire = otpExpire;
    doctor.resetPasswordOtpVerified = false;

    await doctor.save();

    console.log("OTP saved");
    console.log("OTP expires:", new Date(otpExpire));

    // Send OTP
    const emailSent = await sendPasswordResetOtp(
      doctor.email,
      otp,
      doctor.name,
    );

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Unable to send OTP email",
      });
    }

    console.log("OTP email sent");
    console.log("====================================");

    return res.json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while sending OTP",
    });
  }
};

// ======================================================
// VERIFY RESET PASSWORD OTP
// ======================================================

export const verifyResetPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const cleanEmail = email?.trim().toLowerCase();
    const cleanOtp = String(otp || "").trim();

    console.log("====================================");
    console.log("VERIFY RESET OTP");
    console.log("Email:", cleanEmail);
    console.log("OTP entered:", cleanOtp);

    if (!cleanEmail || !cleanOtp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    if (!/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must be 6 digits",
      });
    }

    const doctor = await doctorModel.findOne({
      email: cleanEmail,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check OTP exists
    if (!doctor.resetPasswordOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP.",
      });
    }

    // Check expiry
    if (
      !doctor.resetPasswordOtpExpire ||
      Date.now() > Number(doctor.resetPasswordOtpExpire)
    ) {
      doctor.resetPasswordOtp = null;
      doctor.resetPasswordOtpExpire = null;
      doctor.resetPasswordOtpVerified = false;

      await doctor.save();

      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new OTP.",
      });
    }

    // Hash entered OTP
    const hashedEnteredOtp = crypto
      .createHash("sha256")
      .update(cleanOtp)
      .digest("hex");

    console.log("Entered OTP hash:", hashedEnteredOtp);

    console.log("Database OTP hash:", doctor.resetPasswordOtp);

    // Compare
    if (hashedEnteredOtp !== doctor.resetPasswordOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    /*
      OTP IS CORRECT

      Do NOT delete the OTP here.

      We need resetPasswordOtpVerified=true
      so the next API call can change the password.
    */

    doctor.resetPasswordOtpVerified = true;

    await doctor.save();

    console.log("OTP VERIFIED SUCCESSFULLY");
    console.log("====================================");

    return res.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify reset OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while verifying OTP",
    });
  }
};

// ======================================================
// RESEND RESET PASSWORD OTP
// ======================================================

export const resendResetPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const doctor = await doctorModel.findOne({
      email: cleanEmail,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Generate new OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const otpExpire = Date.now() + 2 * 60 * 1000;

    doctor.resetPasswordOtp = hashedOtp;
    doctor.resetPasswordOtpExpire = otpExpire;
    doctor.resetPasswordOtpVerified = false;

    await doctor.save();

    const emailSent = await sendPasswordResetOtp(
      doctor.email,
      otp,
      doctor.name,
    );

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Unable to send OTP email",
      });
    }

    return res.json({
      success: true,
      message: "New OTP sent successfully",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while resending OTP",
    });
  }
};

// ======================================================
// CHANGE PASSWORD AFTER OTP
// IMPORTANT:
// NO authDoctor middleware is required.
// ======================================================

export const resetPasswordByOtp = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const cleanEmail = email?.trim().toLowerCase();

    console.log("====================================");
    console.log("RESET PASSWORD");
    console.log("Email:", cleanEmail);

    if (!cleanEmail || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const doctor = await doctorModel.findOne({
      email: cleanEmail,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    /*
      THIS IS THE IMPORTANT PART.

      We do NOT check JWT here.

      Password reset happens before login,
      therefore there is no doctor login token.
    */

    if (!doctor.resetPasswordOtpVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify OTP before changing password",
      });
    }

    // Make sure OTP has not expired
    if (
      !doctor.resetPasswordOtpExpire ||
      Date.now() > Number(doctor.resetPasswordOtpExpire)
    ) {
      doctor.resetPasswordOtp = null;
      doctor.resetPasswordOtpExpire = null;
      doctor.resetPasswordOtpVerified = false;

      await doctor.save();

      return res.status(400).json({
        success: false,
        message: "Password reset session expired. Please request a new OTP.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    doctor.password = hashedPassword;

    // Clear reset session
    doctor.resetPasswordOtp = null;
    doctor.resetPasswordOtpExpire = null;
    doctor.resetPasswordOtpVerified = false;

    await doctor.save();

    console.log("PASSWORD CHANGED SUCCESSFULLY");
    console.log("====================================");

    return res.json({
      success: true,
      message: "Password changed successfully. Please login.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while changing password",
    });
  }
};

// ======================================================
// DOCTOR LIST
// ======================================================

export const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel
      .find({
        isDraft: false,
      })
      .select("-password");

    return res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error("Doctor list error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// CHANGE AVAILABILITY
// ======================================================

export const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const doctor = await doctorModel.findById(docId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    doctor.available = !doctor.available;

    await doctor.save();

    return res.json({
      success: true,
      message: "Availability changed",
    });
  } catch (error) {
    console.error("Change availability error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// DOCTOR APPOINTMENTS
// ======================================================

export const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.doctorId;

    const appointments = await appointmentModel
      .find({
        docId,
      })
      .sort({
        slotDate: -1,
      });

    return res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Doctor appointments error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// CANCEL APPOINTMENT
// ======================================================

export const appointmentCancelDoc = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.doctorId;

    const appointment = await appointmentModel.findOne({
      _id: appointmentId,
      docId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.cancelled = true;

    await appointment.save();

    return res.json({
      success: true,
      message: "Appointment cancelled",
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// COMPLETE APPOINTMENT
// ======================================================

export const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.doctorId;

    const appointment = await appointmentModel.findOne({
      _id: appointmentId,
      docId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.isCompleted = true;

    await appointment.save();

    return res.json({
      success: true,
      message: "Appointment completed",
    });
  } catch (error) {
    console.error("Complete appointment error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// DOCTOR DASHBOARD
// ======================================================

export const doctorDashboard = async (req, res) => {
  try {
    const docId = req.doctorId;

    const appointments = await appointmentModel.find({
      docId,
    });

    let earnings = 0;
    let patients = new Set();

    appointments.forEach((item) => {
      if (item.isCompleted && !item.cancelled) {
        earnings += Number(item.amount || 0);
      }

      if (item.userId) {
        patients.add(item.userId.toString());
      }
    });

    const latestAppointments = await appointmentModel
      .find({
        docId,
      })
      .sort({
        createdAt: -1,
      })
      .limit(10);

    return res.json({
      success: true,
      dashData: {
        earnings,
        patients: patients.size,
        appointments: appointments.length,
        latestAppointments,
      },
    });
  } catch (error) {
    console.error("Doctor dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// DOCTOR PROFILE
// ======================================================

export const doctorProfile = async (req, res) => {
  try {
    const docId = req.doctorId;

    const profileData = await doctorModel.findById(docId).select("-password");

    if (!profileData) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.json({
      success: true,
      profileData,
    });
  } catch (error) {
    console.error("Doctor profile error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET SINGLE APPOINTMENT
// ======================================================

export const getAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.query;
    const docId = req.doctorId;

    const appointment = await appointmentModel.findOne({
      _id: appointmentId,
      docId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error("Get appointment error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// UPDATE DOCTOR PROFILE
// ======================================================

export const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.doctorId;

    const {
      name,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      workingDays,
    } = req.body;

    const doctor = await doctorModel.findById(docId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (name !== undefined) doctor.name = name;

    if (speciality !== undefined) {
      doctor.speciality = speciality;
    }

    if (degree !== undefined) {
      doctor.degree = degree;
    }

    if (experience !== undefined) {
      doctor.experience = experience;
    }

    if (about !== undefined) {
      doctor.about = about;
    }

    if (fees !== undefined) {
      doctor.fees = Number(fees);
    }

    if (address !== undefined) {
      try {
        doctor.address =
          typeof address === "string" ? JSON.parse(address) : address;
      } catch {
        doctor.address = address;
      }
    }

    if (workingDays !== undefined) {
      try {
        doctor.workingDays =
          typeof workingDays === "string"
            ? JSON.parse(workingDays)
            : workingDays;
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid workingDays format",
        });
      }
    }

    // Update image
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });

      doctor.image = imageUpload.secure_url;
    }

    await doctor.save();

    return res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update doctor profile error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
