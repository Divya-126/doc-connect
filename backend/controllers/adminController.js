import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import { sendDoctorAccount } from "./email/email.js";
import { upsertStreamUser } from "../lib/stream.js";
import "dotenv/config";

// FUNCTION FOR THE DOCTOR
const generatePassword = (length = 8) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%abcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";

  if (length < 8) {
    length = 8; // ensure minimum length
  }

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
};
// ADD DOCTOR
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    const password = generatePassword();
    if (password.length < 8) {
      return res.json({ success: false, message: "Password too short" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //====== Cloudinary Upload =========
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const imageUrl = imageUpload?.secure_url;

    // ===============================

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees: Number(fees),
      address: JSON.parse(address),
      date: Date.now(),
      isDraft: false,
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    try {
      // stream user
      await upsertStreamUser({
        id: newDoctor._id.toString(),
        name: newDoctor.name,
        image: newDoctor?.image || "",
      });
    } catch (err) {
      console.log("Stream Error", err);
      return res.json({
        success: false,
        message: "Stream user creation failed",
      });
    }

    sendDoctorAccount(newDoctor?.email, password);
    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// LOGIN ADMIN
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ id: email }, process.env.JWT_SECRET);

      res.json({
        success: true,
        token,
      });
    } else {
      res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL DOCTORS
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");

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

// CHANGE AVAILABILITY
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    res.json({
      success: true,
      message: "Availability Changed",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// SAVE DOCTOR AS DRAFT
const saveDoctorDraft = async (req, res) => {
  try {
    const { id } = req.params;

    await doctorModel.findByIdAndUpdate(id, {
      isDraft: true,
    });

    res.json({
      success: true,
      message: "Doctor moved to draft",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// RESTORE DOCTOR
const restoreDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    await doctorModel.findByIdAndUpdate(id, {
      isDraft: false,
    });

    res.json({
      success: true,
      message: "Doctor restored",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE DOCTOR
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 check active appointments
    const appointments = await appointmentModel.find({
      docId: id,
      cancelled: false,
    });

    if (appointments.length > 0) {
      return res.json({
        success: false,
        message: "Doctor has active appointments. Please draft instead.",
      });
    }

    // 🔹 delete doctor
    await doctorModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// GET APPOINTMENTS
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// CANCEL APPOINTMENT
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime,
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({
      success: true,
      message: "Appointment Cancelled",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ADMIN DASHBOARD
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ isDraft: false });
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({
      success: true,
      dashData,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  changeAvailability,
  saveDoctorDraft,
  restoreDoctor,
  deleteDoctor,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
};
