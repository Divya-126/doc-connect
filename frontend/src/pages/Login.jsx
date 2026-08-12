import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoaderText from "../componenets/Loader.jsx";
import { Lock, Eye, EyeOff, Mail, ShieldCheck, User2Icon } from "lucide-react";
import OtpTimer from "../componenets/OtpTimmer.jsx";
import LandingImage from "../componenets/LandingImage.jsx";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const [state, setState] = useState("Sign Up");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setState("verify-email");
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } else if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("login successfully..!");
        } else {
          if (!data.isVerified) {
            setState("verify-email");
            toast.success(data?.message);
          }

          toast.error(data?.error);
        }
      } else if (state === "verify-email") {
        const { data } = await axios.post(
          backendUrl + "/api/user/verify-email",
          {
            email,
            otp,
          },
        );

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success(data.message);
        } else {
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Somthing went wrong");
      console.log(error?.response);
    } finally {
      setIsLoading(false);
    }
  };
  const resendOtp = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/user/resend-otp", {
        email,
      });

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Otp not sending");
      console.log(error?.response);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const value = e.target.value;

    // allow only numbers
    if (/^\d*$/.test(value)) {
      setOtp(value);
    }
  };

  const maskEmail = (email) => {
    const [name, domain] = email.split("@");

    if (name.length <= 4) {
      return name[0] + "****@" + domain;
    }

    const start = name.slice(0, 3);
    const end = name.slice(-2);

    return `${start}*******${end}@${domain}`;
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
          <h2 className="text-4xl my-4 font-bold bg-gradient-to-l from-indigo-400 via-indigo-500 to-indigo-600 text-transparent bg-clip-text">
            {state === "Sign Up"
              ? "Create Account"
              : state === "Login"
                ? "Login"
                : "Verify Your Email"}
          </h2>

          {state !== "verify-email" && (
            <p className="text-sm text-gray-500/90 mt-3">
              {state === "Sign Up"
                ? "Welcome! Please sign up to create account"
                : "Welcome back! Please sign in to continue"}
            </p>
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

          {/* Full Name — ONLY for Sign Up */}
          {state === "Sign Up" && (
            <div className="flex group items-center w-full mt-6 bg-transparent border border-gray-500 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:shadow-[0_0_4px_#616060]">
              <User2Icon className="size-4 text-slate-600 group-focus-within:text-indigo-400 transition" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent text-slate-600 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>
          )}

          {/* Email */}
          {state !== "verify-email" && (
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

          {/* Password */}
          {state !== "verify-email" && (
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

          {/* Remember / Forgot — Login only */}
          {state === "Login" && (
            <div className="w-full flex items-center justify-between mt-8 text-gray-500">
              <span
                onClick={() => navigate("/forget-password")}
                className="text-sm text-blue-600 underline cursor-pointer"
              >
                Forgot password?
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-8 w-full h-11  rounded-full text-white ${isLoading ? "bg-gradient-to-l from-blue-200 via-blue-300 to-blue-400 " : "bg-gradient-to-l from-blue-400 via-blue-500 to-blue-600 active:scale-95 hover:shadow-[0_0_8px_#6c7ee3]"} transition-all duration-200 `}
          >
            {state === "Sign Up" ? (
              isLoading ? (
                <LoaderText text="Creating..." />
              ) : (
                "Create account"
              )
            ) : state === "Login" ? (
              isLoading ? (
                <LoaderText text="Signing..." />
              ) : (
                "Login"
              )
            ) : isLoading ? (
              <LoaderText text="Verifying..." />
            ) : (
              "Verify Email"
            )}
          </button>

          {state === "Sign Up" ? (
            <p className="m-5">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setState("Login");
                  setOpen(false);
                  setEmail("");
                  setPassword("");
                  setName("");
                }}
                className="text-primary underline cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            state === "Login" && (
              <p className="m-5 text-gray-600">
                Create a new account?{" "}
                <span
                  onClick={() => {
                    setState("Sign Up");
                    setOpen(false);
                    setEmail("");
                    setPassword("");
                    setName("");
                  }}
                  className="text-primary underline cursor-pointer"
                >
                  Click here
                </span>
              </p>
            )
          )}
        </form>
        {state === "verify-email" && <OtpTimer onResend={resendOtp} />}
      </div>
    </div>
  );
};

export default Login;
