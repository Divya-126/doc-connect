import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { useEffect } from "react";
import { IoMenu } from "react-icons/io5";

const Navbar = () => {
  const location = useLocation();
  const [isLoginPage, setLoginPage] = useState(false);
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  // const [token, setToken] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/login");
  };

  useEffect(() => {
    if (location.pathname === "/login") {
      setLoginPage(true);
    } else {
      setLoginPage(false);
    }
  }, [location]);
  return (
    <div className="sticky top-0 z-50  bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 md:px-12 py-4">
        {/* Logo */}
        <img
          onClick={() => navigate("/")}
          className="w-40 cursor-pointer  "
          src="/logo.png"
          alt="logo"
        />

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 font-medium text-gray-700">
          {["/", "/doctors", "/about", "/contact"].map((path, index) => {
            const labels = ["Home", "All Doctors", "About", "Contact"];
            return (
              <NavLink
                key={index}
                to={path}
                className={({ isActive }) =>
                  `relative group transition duration-300 ${
                    isActive ? "text-primary" : "hover:text-primary"
                  }`
                }
              >
                <li>{labels[index]}</li>

                {/* Animated underline */}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
            );
          })}
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {token ? (
            <div className="flex items-center gap-2 cursor-pointer group relative">
              <div className="relative w-12 h-12 group">
                {/* Glow Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 blur-md group-hover:opacity-100 transition duration-300"></div>

                {/* Image Container */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                  <img
                    src={userData.image}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <img className="w-3" src={assets.dropdown_icon} alt="" />
              {/* Dropdown */}
              <div className="absolute right-0 top-14 bg-white shadow-xl rounded-xl p-4 w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-primary py-1 cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-primary py-1 cursor-pointer"
                >
                  My Appointments
                </p>
                <p
                  onClick={logout}
                  className="hover:text-red-500 py-1 cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={
                isLoginPage
                  ? () => {
                      return;
                    }
                  : () => navigate("/login")
              }
              className={`hidden md:block ${isLoginPage ? "cursor-not-allowed bg-gradient-to-l from-blue-200 via-blue-300 to-blue-400" : "bg-gradient-to-l from-blue-400 via-blue-500 to-blue-600 active:scale-95 hover:shadow-[0_0_10px_#518ff4] "} text-white px-6 py-2 rounded-full font-medium transition-all duration-200 `}
            >
              Create Account
            </button>
          )}

          <img
            onClick={() => setShowMenu(true)}
            className="w-6 md:hidden cursor-pointer"
            src={assets.menu_icon}
            alt=""
          />

          {/* ---- Mobile Menu ---- */}
        </div>
      </div>
      <div
        className={`md:hidden ${showMenu ? "absolute w-full min-h-screen translate-x-0" : "translate-x-full h-0 w-0"} top-0 right-0  z-20 overflow-hidden bg-white transition-all duration-300`}
      >
        <div className="flex items-center justify-between px-5 py-6 ">
          <img src="/logo.png" className="w-36" alt="" />

          <img
            onClick={() => setShowMenu(false)}
            src={assets.cross_icon}
            className="w-7 cursor-pointer"
            alt=""
          />
        </div>
        <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
          <NavLink onClick={() => setShowMenu(false)} to="/">
            <p className="px-4 py-2 rounded full inline-block">HOME</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/doctors">
            <p className="px-4 py-2 rounded full inline-block">ALL DOCTORS</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/about">
            <p className="px-4 py-2 rounded full inline-block">ABOUT</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/contact">
            <p className="px-4 py-2 rounded full inline-block">CONTACT</p>
          </NavLink>

          <button
            onClick={() => navigate("/login")}
            className={` bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-medium transition duration-300 shadow-md hover:shadow-lg ${token ? "hidden" : "block"}`}
          >
            Create Account
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
