import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const navigate = useNavigate();

  const { aToken, getDashData, cancelAppointment, dashData } =
    useContext(AdminContext);

  const { slotDateFormat } = useContext(AppContext);

  // Auto refresh every minute
  const [, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  if (!dashData) return null;

  return (
    <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Admin Dashboard
        </h1>
      </div>

      {/* Top Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Total Doctors"
          value={dashData.doctors}
          icon={assets.doctor_icon}
          color="blue"
        />

        <StatCard
          title="Total Appointments"
          value={dashData.appointments}
          icon={assets.appointments_icon}
          color="green"
        />

        <StatCard
          title="Total Patients"
          value={dashData.patients}
          icon={assets.patients_icon}
          color="purple"
        />
      </div>

      {/* Latest Bookings */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-b bg-gray-50 gap-2">
          <div className="flex items-center gap-3">
            <img src={assets.list_icon} alt="" className="w-5" />

            <p className="font-semibold text-gray-800 text-sm sm:text-base">
              Latest Bookings
            </p>
          </div>

          <button
            onClick={() => navigate("/all-appointments")}
            className="text-sm text-indigo-600 hover:underline font-medium"
          >
            View All
          </button>
        </div>

        <div className="divide-y max-h-[400px] overflow-y-auto">
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 sm:px-6 py-4 hover:bg-indigo-50 transition"
            >
              <img
                className="w-12 h-12 rounded-full object-cover border"
                src={item.docData.image}
                alt="Doctor"
              />

              <div className="flex-1">
                <p className="text-gray-800 font-medium text-sm sm:text-base">
                  {item.docData.name}
                </p>

                <p className="text-xs sm:text-sm text-gray-500">
                  Booking on {slotDateFormat(item.slotDate)}
                </p>
              </div>

              <div className="self-start sm:self-center">
                <StatusButton
                  item={item}
                  cancelAppointment={cancelAppointment}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
/* ---------- COMPONENTS ---------- */

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    purple: "bg-purple-100",
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition flex items-center justify-between border">
      <div>
        <p className="text-xs sm:text-sm text-gray-500">{title}</p>

        <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
          {value}
        </p>
      </div>

      <div className={`${colors[color]} p-2 sm:p-3 rounded-xl`}>
        <img className="w-6 sm:w-8" src={icon} alt="" />
      </div>
    </div>
  );
};
/* ---------- STATUS BUTTON ---------- */

const StatusButton = ({ item, cancelAppointment }) => {
  const [day, month, year] = item.slotDate.split("_");

  // Convert "03:30 PM" to 24-hour format
  const [time, period] = item.slotTime.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  const appointmentStart = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    hours,
    minutes,
    0,
  );

  // Appointment duration = 30 minutes
  const appointmentEnd = new Date(appointmentStart);
  appointmentEnd.setMinutes(appointmentEnd.getMinutes() + 30);

  const now = new Date();

  const isMissed = now > appointmentEnd && !item.isCompleted && !item.cancelled;

  // Cancelled
  if (item.cancelled) {
    return (
      <span className="px-3 sm:px-4 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 ring-1 ring-red-200">
        Cancelled
      </span>
    );
  }

  // Completed
  if (item.isCompleted) {
    return (
      <span className="px-3 sm:px-4 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 ring-1 ring-green-200">
        Completed
      </span>
    );
  }

  // Missed
  if (isMissed) {
    return (
      <span className="px-3 sm:px-4 py-1 text-xs font-semibold rounded-full bg-orange-50 text-orange-700 ring-1 ring-orange-200">
        Missed
      </span>
    );
  }

  // Pending
  return (
    <button
      onClick={() => cancelAppointment(item._id)}
      className="px-3 md:px-7 py-1.5 text-xs font-semibold rounded-full
      bg-yellow-100 text-yellow-900
      hover:bg-indigo-700 hover:text-white transition"
    >
      Cancel
    </button>
  );
};

export default Dashboard;
