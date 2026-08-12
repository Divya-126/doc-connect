import client from "../../config/brevo.js";

import {
  doctorAccountTemplate,
  sendVerificationMailTemplate,
  welcomeMailTemplate,
} from "./Templates/emailTemplates.js";

// ======================================================
// SEND EMAIL VERIFICATION OTP
// ======================================================

export const sendEmailVerificationcode = async (email, otp) => {
  try {
    await client.transactionalEmails.sendTransacEmail({
      sender: {
        email: process.env.MY_EMAIL,
        name: "Doc-Connect",
      },

      to: [
        {
          email: email,
        },
      ],

      subject: "Email Verification For Doc-Connect",

      htmlContent: sendVerificationMailTemplate.replace("{otp}", otp),
    });

    console.log("✅ Email verification OTP sent successfully");

    return true;
  } catch (error) {
    console.error("❌ Email verification error:", error);

    return false;
  }
};

// ======================================================
// SEND WELCOME EMAIL
// ======================================================

export const sendWellcomeEmail = async (email, userName) => {
  try {
    await client.transactionalEmails.sendTransacEmail({
      sender: {
        email: process.env.MY_EMAIL,
        name: "Doc-Connect",
      },

      to: [
        {
          email: email,
        },
      ],

      subject: "Welcome To Doc-Connect",

      htmlContent: welcomeMailTemplate.replace("{name}", userName),
    });

    console.log("✅ Welcome email sent successfully");

    return true;
  } catch (error) {
    console.error("❌ Welcome email error:", error);

    return false;
  }
};

// ======================================================
// SEND DOCTOR ACCOUNT DETAILS
// ======================================================

export const sendDoctorAccount = async (email, password) => {
  try {
    await client.transactionalEmails.sendTransacEmail({
      sender: {
        email: process.env.MY_EMAIL,
        name: "Doc-Connect",
      },

      to: [
        {
          email: email,
        },
      ],

      subject: "Your Doctor Account - Doc-Connect",

      htmlContent: doctorAccountTemplate
        .replace("{email}", email)
        .replace("{password}", password),
    });

    console.log("✅ Doctor account email sent successfully");

    return true;
  } catch (error) {
    console.error("❌ Doctor account email error:", error);

    return false;
  }
};

// ======================================================
// SEND PASSWORD RESET OTP
// ======================================================

export const sendPasswordResetOtp = async (email, otp, doctorName) => {
  try {
    await client.transactionalEmails.sendTransacEmail({
      sender: {
        email: process.env.MY_EMAIL,
        name: "Doc-Connect",
      },

      to: [
        {
          email: email,
        },
      ],

      subject: "Doc-Connect Password Reset OTP",

      htmlContent: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          background-color: #ffffff;
        ">

          <h2 style="
            color: #4f46e5;
            margin-bottom: 20px;
          ">
            Doc-Connect Password Reset
          </h2>

          <p>
            Hello ${doctorName || "Doctor"},
          </p>

          <p>
            We received a request to change your
            Doc-Connect password.
          </p>

          <p>
            Your OTP is:
          </p>
          

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #4f46e5;
            margin: 20px 0;
          ">
            ${otp}
          </div>

          <p>
            This OTP is valid for
            <b>2 minutes</b>.
          </p>

          <p>
            For your security, please do not share this OTP
            with anyone.
          </p>

          <p>
            If you did not request this password change,
            please ignore this email.
          </p>

          <hr style="
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 25px 0;
          "/>

          <p style="
            color: #6b7280;
            font-size: 12px;
          ">
            © Doc-Connect
          </p>

        </div>
      `,
    });

    console.log("✅ Password reset OTP sent successfully");

    return true;
  } catch (error) {
    console.error("❌ Password reset OTP email error:", error);

    return false;
  }
};
