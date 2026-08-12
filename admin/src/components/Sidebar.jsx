import { useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { DoctorContext } from "../context/DocterContext.jsx";
import { AdminContext } from "../context/AdminContext.jsx";
import { Info } from "lucide-react";

const Sidebar = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);

  const navLinks = [
    {
      path: aToken ? "/admin-dashboard" : dToken && "/doctor-dashboard",
      lable: "DashBoard",
      icon: assets.home_icon,
    },
    {
      path: aToken ? "/all-appointments" : dToken && "/doctor-appointments",
      lable: "Appointments",
      icon: assets.appointment_icon,
    },
    {
      path: aToken ? "/add-doctor" : dToken && "/doctor-profile",
      lable: aToken ? "Add Doctors" : "Profile",
      icon: aToken ? assets.add_icon : assets.people_icon,
    },
    {
      path: "/doctor-list",
      lable: "Doctors List",
      icon: assets.people_icon,
    },
  ];
  return (
    <div className="min-h-screen bg-white border-r">
      <ul className="text-[#515151] mt-5">
        {(dToken ? navLinks.slice(0, 3) : navLinks).map((val, i) => {
          return (
            <li className="relative group " key={i}>
              <NavLink
                to={val.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-indigo-50 border-r-4  border-primary shadow-sm rounded-md" : ""}`
                }
              >
                <img className="w-4 md:w-6" src={val.icon} alt="" />
                <p className="hidden md:block">{val.lable}</p>
              </NavLink>
              <span className=" md:hidden opacity-0 group-hover:opacity-100 absolute text-xs left-full top-1/2 ml-1 -translate-y-1/2 border px-2 py-[2px] rounded-md border-blue-300  bg-blue-100 text-blue-900 z-10 inline-flex items-center gap-1 justify-center">
                <Info className="size-3" />
                {val.lable}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
