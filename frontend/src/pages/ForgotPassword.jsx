import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import LandingImage from "../componenets/LandingImage";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import LoaderText from "../componenets/Loader";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [state, setState] = useState("email");
  const [open, setOpen] = useState(false);
  const [openCon, setOpenCon] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");

  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ==========================================
      // STEP 1: SEND OTP
      // ==========================================
      if (state === "email") {
        if (!email) {
          toast.error("Please enter your email");
          return;
        }

        const { data } = await axios.post(
          "http://localhost:4000/api/user/forgot-password",
          {
            email,
          },
        );

        if (data.success) {
          toast.success(data.message);

          // Move to OTP screen
          setState("verify-email");
        } else {
          toast.error(data.message);
        }
      }

      // ==========================================
      // STEP 2: VERIFY OTP
      // ==========================================
      else if (state === "verify-email") {
        if (!otp || otp.length !== 6) {
          toast.error("Please enter a valid 6-digit OTP");
          return;
        }

        const { data } = await axios.post(
          "http://localhost:4000/api/user/verify-reset-otp",
          {
            email,
            otp,
          },
        );

        if (data.success) {
          toast.success(data.message);

          // Move to password screen
          setState("enter-password");
        } else {
          toast.error(data.message);
        }
      }

      // ==========================================
      // STEP 3: RESET PASSWORD
      // ==========================================
      else if (state === "enter-password") {
        if (!password || !conPassword) {
          toast.error("Please enter both passwords");
          return;
        }

        if (password !== conPassword) {
          toast.error("Passwords do not match");
          return;
        }

        if (password.length < 8) {
          toast.error("Password must be at least 8 characters");
          return;
        }

        const { data } = await axios.post(
          "http://localhost:4000/api/user/change-password",
          {
            email,
            otp,
            password,
            conPassword,
          },
        );

        if (data.success) {
          toast.success(data.message);

          setTimeout(() => {
            navigate("/login");
          }, 1000);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log("Forgot password error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const maskEmail = (email) => {
    const [name, domain] = email.split("@");

    if (!domain) return email;

    if (name.length <= 4) {
      return name[0] + "****@" + domain;
    }

    const start = name.slice(0, 3);
    const end = name.slice(-2);

    return `${start}*******${end}@${domain}`;
  };

  const handleChange = (e) => {
    const value = e.target.value;

    // allow only numbers
    if (/^\d*$/.test(value)) {
      setOtp(value);
    }
  };

  return (
    <div className="flex h-[600px] w-full mt-28 bg-gray-100 rounded-xl overflow-hidden shadow shadow-slate-400">
      {/* Left side image */}
      <LandingImage />
      <div className="w-full px-4 md:px-0 flex flex-col items-center justify-center">
        <form
          onSubmit={onSubmitHandler}
          className="md:w-96 w-full flex flex-col items-center justify-center"
        >
          <h2 className="text-4xl my-4 font-bold bg-gradient-to-l text-center from-indigo-400 via-indigo-500 to-indigo-600 text-transparent bg-clip-text">
            {state === "email"
              ? "Find Your Account"
              : state === "enter-password"
                ? "Reset your password"
                : "Verify Your Email"}
          </h2>

          {state !== "verify-email" && (
            <div className=" flex w-full items-center flex-col mt-3">
              <h2 className="text-xl font-semibold">
                {state === "enter-password"
                  ? "Create New Password"
                  : "Recover Your Account"}
              </h2>
              <p className="text-sm text-gray-500 text-center">
                {state === "email"
                  ? "Enter your email to find your account"
                  : "Enter new password to continue"}
              </p>
            </div>
          )}

          {state === "verify-email" && (
            <div className=" flex w-full items-center flex-col mt-3">
              <h2 className="text-xl font-semibold">
                Verify your email to continue
              </h2>

              <p className="text-sm text-gray-500 text-center ">
                Enter the 6-digit code sent to {maskEmail(email)}
              </p>
            </div>
          )}

          {/* Email */}
          {state === "email" && (
            <div className="flex group  items-center w-full mt-6 bg-transparent border border-gray-500 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:shadow-[0_0_4px_#616060]">
              <Mail className="size-4 text-slate-600 group-focus-within:text-indigo-400 transition" />
              <input
                type="email"
                placeholder="Email id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-slate-600 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>
          )}

          {state === "verify-email" && (
            <div className="group flex items-center mt-6 w-full bg-transparent border border-gray-500 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:shadow-[0_0_4px_#616060] transition">
              <ShieldCheck className="size-4 text-slate-600 group-focus-within:text-blue-400 transition" />

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                maxLength={6}
                onChange={handleChange}
                className="bg-transparent text-slate-600 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>
          )}

          {state === "enter-password" && (
            <div className="flex relative group items-center mt-6 w-full bg-transparent border border-gray-500 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:shadow-[0_0_4px_#616060]">
              <Lock className="size-4 text-slate-600 group-focus-within:text-indigo-400 transition" />
              <input
                type={open ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent pr-12 text-slate-600 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
              <span
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setOpen((prev) => !prev);
                }}
                className=" absolute text-slate-700 group-focus-within:text-indigo-400 cursor-pointer right-6 top-1/2 -translate-y-1/2"
              >
                {open ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </span>
            </div>
          )}
          {/* confirm password */}
          {state === "enter-password" && (
            <div className="flex relative group items-center mt-6 w-full bg-transparent border border-gray-500 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:shadow-[0_0_4px_#616060]">
              <Lock className="size-4 text-slate-600 group-focus-within:text-indigo-400 transition" />
              <input
                type={openCon ? "text" : "password"}
                placeholder="Confirm Password"
                value={conPassword}
                onChange={(e) => setConPassword(e.target.value)}
                className="bg-transparent pr-12 text-slate-600 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
              <span
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setOpenCon((prev) => !prev);
                }}
                className=" absolute text-slate-700 group-focus-within:text-indigo-400 cursor-pointer right-6 top-1/2 -translate-y-1/2"
              >
                {openCon ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </span>
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`mt-5 w-full h-11  rounded-full text-white ${isLoading ? "bg-gradient-to-l from-blue-200 via-blue-300 to-blue-400 " : "bg-gradient-to-l from-blue-400 via-blue-500 to-blue-600 active:scale-95 hover:shadow-[0_0_8px_#6c7ee3]"} transition-all duration-200 `}
          >
            {state === "email" ? (
              isLoading ? (
                <LoaderText text="Sending..." />
              ) : (
                "Send Code"
              )
            ) : state === "enter-password" ? (
              isLoading ? (
                <LoaderText text="Updating..." />
              ) : (
                "Reset Password"
              )
            ) : isLoading ? (
              <LoaderText text="Verifying..." />
            ) : (
              "Verify Email"
            )}
          </button>

          {/* BACK */}

          <p className="text-center mt-5">
            <span
              onClick={() => navigate("/login")}
              className="text-primary underline cursor-pointer text-sm"
            >
              Back to Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
