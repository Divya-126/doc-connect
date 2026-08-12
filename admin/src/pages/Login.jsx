import axios from "axios";
import { useContext, useState } from "react";

import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DocterContext.jsx";
import { Eye, EyeClosed, EyeOffIcon, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { setDToken } = useContext(DoctorContext);
  const { setAToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      if (state === "Admin") {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
          email,
          password,
        });

        if (data.success) {
          setAToken(data.token);
          localStorage.setItem("aToken", data.token);
          toast.success("Admin login successful");
        } else {
          toast.error(data.message || "Invalid credentials");
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, {
          email,
          password,
        });

        if (data.success) {
          setDToken(data.token);
          localStorage.setItem("dToken", data.token);
          toast.success("Doctor login successful");
        } else {
          toast.error(data.message || "Invalid credentials");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const switchLogin = (type) => {
    setState(type);
    setEmail("");
    setPassword("");
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-transparent bg-gradient-to-l from-blue-400 via-blue-500 to-blue-600 bg-clip-text inline-block">
            {state}
          </span>{" "}
          Login
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="outline-none pl-3 py-2 cursor-pointer rounded-md shadow shadow-slate-300 transition-shadow duration-200 hover:shadow-[0_0_5px_#484747] w-full  mt-1 focus:shadow-[0_0_5px_#484747]"
            type="email"
            placeholder="Enter email"
            required
          />
        </div>

        <div className="w-full ">
          <p>Password</p>
          <div className="relative">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="outline-none pr-10 pl-3 py-2 relative cursor-pointer rounded-md shadow shadow-slate-300 transition-shadow duration-200  hover:shadow-[0_0_5px_#484747] w-full  mt-1 focus:shadow-[0_0_5px_#484747]"
              type={open ? "text" : "password"}
              placeholder="Enter password"
              required
            />
            <span
              onClick={() => {
                setOpen((prev) => !prev);
              }}
              className="absolute right-4 top-3.5 cursor-pointer "
            >
              {open ? (
                <EyeOffIcon className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </span>
          </div>
        </div>

        <button
          disabled={isLoading}
          className={`bg-gradient-to-l ${isLoading ? "bg-primary" : "from-indigo-400 via-indigo-500 to-indigo-600"} text-white w-full py-2 rounded-md text-base hover:opacity-90 transition flex items-center gap-2 justify-center`}
        >
          {isLoading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Login...
            </>
          ) : (
            "Login"
          )}
        </button>

        {state === "Doctor" && (
          <div className="text-right mt-1">
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-primary underline cursor-pointer text-sm"
            >
              Forgot / Change Password?
            </span>
          </div>
        )}

        {state === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span
              onClick={() => switchLogin("Doctor")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              onClick={() => switchLogin("Admin")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
