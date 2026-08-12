import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  speciality: {
    type: String,
    required: true,
  },

  degree: {
    type: String,
    required: true,
  },

  experience: {
    type: String,
    required: true,
  },

  about: {
    type: String,
    required: true,
  },

  available: {
    type: Boolean,
    default: true,
  },

  fees: {
    type: Number,
    required: true,
  },

  address: {
    type: Object,
    required: true,
  },

  date: {
    type: String,
  },

  slots_booked: {
    type: Object,
    default: {},
  },

  resetPasswordOtp: {
    type: String,
    default: null,
  },

  resetPasswordOtpExpire: {
    type: Number,
    default: null,
  },

  resetPasswordOtpVerified: {
    type: Boolean,
    default: false,
  },

  workingDays: {
    type: [
      {
        day: String,

        startTime: String,

        endTime: String,

        breaks: [
          {
            start: String,
            end: String,
          },
        ],
      },
    ],

    default: [
      {
        day: "Monday",
        startTime: "09:00",
        endTime: "17:00",
        breaks: [
          {
            start: "13:00",
            end: "14:00",
          },
        ],
      },

      {
        day: "Tuesday",
        startTime: "09:00",
        endTime: "17:00",
        breaks: [
          {
            start: "13:00",
            end: "14:00",
          },
        ],
      },

      {
        day: "Wednesday",
        startTime: "09:00",
        endTime: "17:00",
        breaks: [
          {
            start: "13:00",
            end: "14:00",
          },
        ],
      },

      {
        day: "Thursday",
        startTime: "09:00",
        endTime: "17:00",
        breaks: [
          {
            start: "13:00",
            end: "14:00",
          },
        ],
      },

      {
        day: "Friday",
        startTime: "09:00",
        endTime: "17:00",
        breaks: [
          {
            start: "13:00",
            end: "14:00",
          },
        ],
      },

      {
        day: "Saturday",
        startTime: "09:00",
        endTime: "14:00",
        breaks: [],
      },

      {
        day: "Sunday",
        startTime: "",
        endTime: "",
        breaks: [],
      },
    ],
  },

  // ====================================================
  // DRAFT
  // ====================================================

  isDraft: {
    type: Boolean,
    default: false,
  },

  // ====================================================
  // PASSWORD RESET
  // ====================================================

  resetPasswordToken: {
    type: String,
    default: null,
  },

  resetPasswordExpire: {
    type: Date,
    default: null,
  },
});

const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

export default doctorModel;
