import { useContext } from "react";
import { AdminContext } from "../context/AdminContext.jsx";
import { DoctorContext } from "../context/DocterContext.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);

  const navigate = useNavigate();

  const logout = () => {
    // clear admin token
    setAToken("");
    localStorage.removeItem("aToken");

    // clear doctor token
    setDToken("");
    localStorage.removeItem("dToken");

    // redirect to login
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-3 text-xs">
        {/* Logo */}
        <img
          onClick={() => navigate("/")}
          className="w-32 md:w-40 cursor-pointer"
          src="/logo.png"
          alt="Logo"
        />

        {/* Role Label */}
        <p className="border px-1.5 md:px-2.5 py-0.5 text-xs md:text-sm rounded-full border-gray-500 text-gray-600">
          {aToken ? "Admin" : "Doctor"}
        </p>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="bg-gradient-to-l from-blue-300 via-blue-400 to-blue-500 text-white text-sm md:text-lg px-4 md:px-10 py-1.5 md:py-2 text-center rounded-full shadow-lg hover:scale-105 transition-all duration-300"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
