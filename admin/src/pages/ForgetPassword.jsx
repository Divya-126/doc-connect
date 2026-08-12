import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/forgot-password`,
        {
          email: cleanEmail,
        },
      );

      console.log("Forgot password response:", data);

      if (data.success) {
        toast.success("OTP sent to your email");

        navigate("/reset-password", {
          state: {
            email: cleanEmail,
          },
        });
      } else {
        toast.error(data.message || "Unable to send OTP");
      }
    } catch (error) {
      console.error("Forgot password error:", error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-[350px] sm:w-[400px]">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md"
        >
          {/* HEADER */}

          <div className="text-center mb-7">
            <h1 className="text-2xl font-semibold text-gray-800">
              Forgot Password
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Enter your registered email to receive an OTP.
            </p>
          </div>

          {/* EMAIL */}

          <div className="w-full mb-5">
            <p>Email</p>

            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="outline-none pl-3 py-2 cursor-pointer rounded-md shadow shadow-slate-300 transition-shadow duration-200 hover:shadow-[0_0_5px_#484747] w-full mt-1 focus:shadow-[0_0_5px_#484747]"
              type="email"
              placeholder="Enter email"
              required
            />
          </div>

          {/* SEND OTP */}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-l from-indigo-400 via-indigo-500 to-indigo-600 text-white w-full py-2 rounded-md text-base hover:opacity-90 transition flex items-center gap-2 justify-center disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Sending OTP...
              </>
            ) : (
              "Send OTP"
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
