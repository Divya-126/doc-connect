import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

import jwt from "jsonwebtoken";
import { razorpayInstance } from "../config/razorpay.js";
import { sendEmailVerificationcode, sendWellcomeEmail } from "./email/email.js";
import { upsertStreamUser } from "../lib/stream.js";

// ==========================
// Generate Otp
// ==========================
const generateOTPWithTime = () => {
  const emailOtp = {
    otp: Math.floor(100000 + Math.random() * 900000).toString(),
    otpTime: new Date(Date.now() + 60 * 1000),
  };
  return emailOtp;
};

// ==========================
// REGISTER USER
// ==========================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist!" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const emailOtp = generateOTPWithTime();
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      emailOtp: emailOtp,
    });

    await newUser.save();

    try {
      // on stream
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.name,
        image: newUser?.image || "",
      });
    } catch (err) {
      console.log("Stream Error", err);
    }

    sendEmailVerificationcode(email, emailOtp?.otp);
    res.json({
      success: true,
      message: "Verification code Send to your Email!",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// =========================
// GET APPOINTMENT BY ID
// ==========================
const getAppointment = async (req, res) => {
  try {
    const appId = req.params.appId;
    if (!appId) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment Id Is missing" });
    }
    const appoinment = await appointmentModel.findById(appId);

    if (!appoinment) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid appointment" });
    }

    res.status(200).json({ success: true, appoinment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// VERIFY EMAIL
//===========================
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (otp.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Enter Valid OTP" });
    }
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    if (!user.emailOtp?.otp) {
      return res.status(400).json({ message: "OTP not found" });
    }

    // check for expired otp
    if (new Date() > user.emailOtp?.otpTime) {
      return res.status(400).json({
        message: "OTP expired, Please resend otp",
      });
    }

    // check valid otp
    if (user.emailOtp.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.isEmailVerified = true;
    user.emailOtp = {
      otp: "",
      otpTime: null,
    };
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    sendWellcomeEmail(user.email, user.name);
    res
      .status(200)
      .json({ success: true, message: "Email verified successfully !", token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// RESEND OTP FUNCTION
// =========================
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist, Please enter valid email",
      });
    }

    // const genrating otp
    const emailOtp = generateOTPWithTime();

    user.emailOtp = emailOtp;
    await user.save();
    sendEmailVerificationcode(user.email, user.emailOtp?.otp);

    return res
      .status(200)
      .json({ success: true, message: "Email verificion code sent!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.log(error);
  }
};

// ==========================
// LOGIN USER
// ==========================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist ",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      if (user.isEmailVerified) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res
          .status(200)
          .json({ success: true, isVerified: user.isEmailVerified, token });
      } else {
        const emailOtp = generateOTPWithTime();
        user.emailOtp = emailOtp;
        await user.save();
        sendEmailVerificationcode(user.email, user.emailOtp?.otp);
        return res.json({
          success: false,
          isVerified: false,
          message: "Verification code send to your email!",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        error: "Invalid credentials",
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ==========================
// GET DOCTOR LIST FOR USERS
// ==========================
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel
      .find({
        isDraft: false, // only active doctors
      })
      .select("-password");

    res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// GET USER PROFILE
// ==========================
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId).select("-password");

    res.json({
      success: true,
      userData,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ==========================
// UPDATE USER PROFILE
// ==========================
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({
        success: false,
        message: "Data Missing",
      });
    }

    const user = await userModel.findByIdAndUpdate(userId, {
      name: name,
      phone: phone,
      address: address,
      dob: dob,
      gender: gender,
    });
    await appointmentModel.updateMany(
      { userId: userId },
      {
        $set: {
          "userData.name": name,
          "userData.phone": phone,
          "userData.address": address,
          "userData.dob": dob,
          "userData.gender": gender,
        },
      },
    );
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });

      const imageURL = imageUpload.secure_url;

      user.image = imageURL;
      user.save();

      await appointmentModel.updateMany(
        { userId: userId },
        { "userData.image": imageURL },
      );
    }

    try {
      // on stream
      await upsertStreamUser({
        id: user._id.toString(),
        name: user.name,
        image: user.image || "",
      });
      console.log("stream client updated");
    } catch (err) {
      console.log("Stream Error", err);
    }

    res.json({
      success: true,
      message: "Profile Updated",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ==========================
// BOOK APPOINTMENT
// ==========================
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }

    // ❗ prevent booking draft doctors
    if (docData.isDraft) {
      return res.json({
        success: false,
        message: "Doctor currently unavailable",
      });
    }

    if (!docData.available) {
      return res.json({
        success: false,
        message: "Doctor Not Available",
      });
    }

    let slots_booked = docData.slots_booked;

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({
          success: false,
          message: "Slot Not Available",
        });
      }

      slots_booked[slotDate].push(slotTime);
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);

    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docId, {
      slots_booked,
    });

    res.json({
      success: true,
      message: "Appointment Booked",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ==========================
// LIST USER APPOINTMENTS
// ==========================
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;

    const appointments = await appointmentModel.find({ userId });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ==========================
// CANCEL APPOINTMENT
// ==========================
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData.userId !== userId) {
      return res.json({
        success: false,
        message: "Unauthorized action",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime,
    );

    await doctorModel.findByIdAndUpdate(docId, {
      slots_booked,
    });

    res.json({
      success: true,
      message: "Appointment Cancelled",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ==========================
// RAZORPAY
// ==========================

const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment Cancelled or not found",
      });
    }

    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });

      res.json({
        success: true,
        message: "Payment Successful",
      });
    } else {
      res.json({
        success: false,
        message: "Payment Failed",
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ==========================
// FORGOT PASSWORD
// ==========================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    const otp = generateOTPWithTime();

    user.emailOtp = otp;
    await user.save();

    await sendEmailVerificationcode(user.email, otp.otp);

    res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email",
    });
  } catch (error) {
    console.log("Forgot password error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// VERIFY RESET PASSWORD OTP
// ==========================
const verifyResetPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    if (!user.emailOtp?.otp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (new Date() > user.emailOtp.otpTime) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please resend OTP",
      });
    }

    if (user.emailOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log("Verify reset OTP error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// RESET PASSWORD BY OTP
// ==========================
const resetPasswordByOtp = async (req, res) => {
  try {
    const { email, otp, password, conPassword } = req.body;

    if (!email || !otp || !password || !conPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== conPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    if (!user.emailOtp?.otp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (new Date() > user.emailOtp.otpTime) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new OTP",
      });
    }

    if (user.emailOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;

    // clear OTP after successful password reset
    user.emailOtp = {
      otp: "",
      otpTime: null,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("Reset password error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// RESEND RESET PASSWORD OTP
// ======================================================

const resendResetPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.emailOtp = {
      otp,
      otpTime: new Date(Date.now() + 10 * 60 * 1000),
    };

    await user.save();

    await sendResetPasswordEmail(email, otp);

    return res.json({
      success: true,
      message: "New OTP sent successfully",
    });
  } catch (error) {
    console.log("❌ Resend reset OTP error:", error);

    return res.json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export {
  registerUser,
  loginUser,
  doctorList,
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
  resetPasswordByOtp,
  resendResetPasswordOtp,
};
