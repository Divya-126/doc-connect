import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Eye, EyeOff, LoaderCircle, ShieldCheck } from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [isResending, setIsResending] = useState(false);

  const [otpVerified, setOtpVerified] = useState(false);

  const [resetToken, setResetToken] = useState("");

  const [resendTimer, setResendTimer] = useState(120);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ======================================================
  // EMAIL CHECK
  // ======================================================

  useEffect(() => {
    if (!email) {
      toast.error("Email is missing. Please request OTP again.");

      navigate("/forgot-password", {
        replace: true,
      });
    }
  }, [email, navigate]);

  // ======================================================
  // OTP TIMER
  // ======================================================

  useEffect(() => {
    if (otpVerified || resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer, otpVerified]);

  // ======================================================
  // FORMAT TIMER
  // ======================================================

  const formatTimer = () => {
    const minutes = Math.floor(resendTimer / 60);

    const seconds = resendTimer % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // ======================================================
  // VERIFY OTP
  // ======================================================

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    const cleanOtp = otp.trim();

    if (!cleanOtp) {
      toast.error("Please enter OTP");
      return;
    }

    if (!/^\d{6}$/.test(cleanOtp)) {
      toast.error("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/verify-reset-otp`,
        {
          email,
          otp: cleanOtp,
        },
      );

      if (data.success) {
        toast.success("OTP verified successfully");

        setResetToken(data.resetToken);

        // Move to password step
        setOtpVerified(true);

        // OTP is no longer needed
        setOtp("");
      } else {
        toast.error(data.message || "Incorrect OTP");
      }
    } catch (error) {
      console.error("OTP verification error:", error);

      toast.error(error.response?.data?.message || "Incorrect or expired OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // ======================================================
  // RESEND OTP
  // ======================================================

  const handleResendOtp = async () => {
    if (resendTimer > 0) {
      return;
    }

    setIsResending(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/forgot-password`,
        {
          email,
        },
      );

      if (data.success) {
        toast.success("New OTP sent to your email");

        setOtp("");

        // New OTP gets a fresh 2 minute timer
        setResendTimer(120);
      } else {
        toast.error(data.message || "Unable to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);

      toast.error(error.response?.data?.message || "Unable to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  // ======================================================
  // CHANGE PASSWORD
  // ======================================================

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!password) {
      toast.error("Please enter new password");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!confirmPassword) {
      toast.error("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/change-password`,
        {
          email,
          newPassword: password,
        },
      );

      console.log("Change password response:", data);

      if (data.success) {
        toast.success("Password changed successfully!");

        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        toast.error(data.message || "Unable to change password");
      }
    } catch (error) {
      console.error("Change password error:", error);

      toast.error(error.response?.data?.message || "Unable to change password");
    } finally {
      setIsLoading(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center mb-7">
          <h1 className="text-2xl font-semibold text-gray-800">
            {otpVerified ? "Change Password" : "Verify OTP"}
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            {otpVerified
              ? "Create a new password for your account."
              : "Enter the OTP sent to your email."}
          </p>

          <p className="text-xs text-gray-400 mt-2">{email}</p>
        </div>

        {/* =================================================
            STEP 1 - OTP
        ================================================= */}

        {!otpVerified ? (
          <form onSubmit={handleVerifyOtp}>
            <div className="w-full mb-5">
              <p>Email OTP</p>

              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 size-4 text-gray-500" />

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit OTP"
                  className="outline-none pl-10 pr-3 py-2 rounded-md shadow shadow-slate-300 transition-shadow duration-200 hover:shadow-[0_0_5px_#484747] w-full mt-1 focus:shadow-[0_0_5px_#484747] tracking-[5px]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-l from-indigo-400 via-indigo-500 to-indigo-600 text-white w-full py-2 rounded-md text-base hover:opacity-90 transition flex items-center gap-2 justify-center disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Verifying OTP...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>

            {/* RESEND */}

            <div className="text-center mt-4">
              {resendTimer > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend OTP in{" "}
                  <span className="font-semibold text-indigo-600">
                    {formatTimer()}
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-sm text-indigo-600 underline cursor-pointer disabled:opacity-50"
                >
                  {isResending ? "Sending OTP..." : "Resend OTP"}
                </button>
              )}
            </div>
          </form>
        ) : (
          /* =================================================
             STEP 2 - PASSWORD
          ================================================= */

          <form onSubmit={handleChangePassword}>
            {/* NEW PASSWORD */}

            <div className="w-full mb-4">
              <p>New Password</p>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="outline-none pr-10 pl-3 py-2 rounded-md shadow shadow-slate-300 transition-shadow duration-200 hover:shadow-[0_0_5px_#484747] w-full mt-1 focus:shadow-[0_0_5px_#484747]"
                />

                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-3.5 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </span>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}

            <div className="w-full mb-5">
              <p>Confirm Password</p>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="outline-none pr-10 pl-3 py-2 rounded-md shadow shadow-slate-300 transition-shadow duration-200 hover:shadow-[0_0_5px_#484747] w-full mt-1 focus:shadow-[0_0_5px_#484747]"
                />

                <span
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-3.5 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </span>
              </div>
            </div>

            {/* CHANGE PASSWORD */}

            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-l from-indigo-400 via-indigo-500 to-indigo-600 text-white w-full py-2 rounded-md text-base hover:opacity-90 transition flex items-center gap-2 justify-center disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        )}

        {/* =================================================
            BACK TO LOGIN
        ================================================= */}

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-sm text-primary underline cursor-pointer mt-5 block mx-auto"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
