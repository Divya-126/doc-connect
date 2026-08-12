import React, { useEffect, useContext, useMemo, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments } =
    useContext(AdminContext);

  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  const [filter, setFilter] = useState("total");

  // Refresh every minute
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const stats = useMemo(() => {
    const total = appointments.length;

    const completed = appointments.filter((item) => item.isCompleted).length;

    const cancelled = appointments.filter((item) => item.cancelled).length;

    const missed = appointments.filter((item) => {
      const [day, month, year] = item.slotDate.split("_");

      const [time, period] = item.slotTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      const end = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        hours,
        minutes,
      );

      end.setMinutes(end.getMinutes() + 30);

      return new Date() > end && !item.cancelled && !item.isCompleted;
    }).length;

    const pending = appointments.filter((item) => {
      const [day, month, year] = item.slotDate.split("_");

      const [time, period] = item.slotTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      const end = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        hours,
        minutes,
      );

      end.setMinutes(end.getMinutes() + 30);

      const isMissed = new Date() > end && !item.cancelled && !item.isCompleted;

      return !item.cancelled && !item.isCompleted && !isMissed;
    }).length;

    return {
      total,
      completed,
      pending,
      cancelled,
      missed,
    };
  }, [appointments, currentTime]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const [day, month, year] = item.slotDate.split("_");

      const [time, period] = item.slotTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      const end = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        hours,
        minutes,
      );

      end.setMinutes(end.getMinutes() + 30);

      const missed = new Date() > end && !item.cancelled && !item.isCompleted;

      switch (filter) {
        case "completed":
          return item.isCompleted;

        case "pending":
          return !item.isCompleted && !item.cancelled && !missed;

        case "missed":
          return missed;

        case "cancelled":
          return item.cancelled;

        default:
          return true;
      }
    });
  }, [appointments, filter]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden sm:overflow-y-auto p-8 bg-gray-50">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          All Appointments
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage patient bookings and doctor schedules
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
        <div onClick={() => setFilter("total")}>
          <StatCard title="Total" value={stats.total} color="indigo" />
        </div>

        <div onClick={() => setFilter("completed")}>
          <StatCard title="Completed" value={stats.completed} color="green" />
        </div>

        <div onClick={() => setFilter("pending")}>
          <StatCard title="Pending" value={stats.pending} color="yellow" />
        </div>

        <div onClick={() => setFilter("missed")}>
          <StatCard title="Missed" value={stats.missed} color="cyan" />
        </div>

        <div onClick={() => setFilter("cancelled")}>
          <StatCard title="Cancelled" value={stats.cancelled} color="red" />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="hidden lg:flex flex-col h-full">
          <div className="grid grid-cols-7 px-6 py-4 text-sm font-semibold text-white border-b bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
            <p>#</p>
            <p>Patient</p>
            <p>Doctor</p>
            <p>Date</p>
            <p>Time</p>
            <p>Fee</p>
            <p className="text-center">Status</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredAppointments.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-7 items-center px-6 py-4 text-sm border-b transition duration-200 hover:bg-indigo-50"
              >
                <p className="text-gray-600">{index + 1}</p>

                <div className="flex items-center gap-3">
                  <img
                    src={item.userData?.image}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover"
                  />

                  <div>
                    <p className="font-medium text-gray-800">
                      {item.userData?.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      Age {calculateAge(item.userData?.dob)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={item.docData?.image}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover"
                  />

                  <p className="font-medium text-gray-800">
                    {item.docData?.name}
                  </p>
                </div>

                <p className="text-gray-600">{slotDateFormat(item.slotDate)}</p>

                <p className="text-gray-600">{item.slotTime}</p>

                <p className="font-medium text-gray-800">
                  {currency} {item.amount}
                </p>

                <div className="flex justify-center">
                  <StatusBadge
                    item={item}
                    cancelAppointment={cancelAppointment}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* MOBILE CARDS */}
        <div className="lg:hidden p-5 space-y-5 overflow-y-auto">
          {filteredAppointments.map((item, index) => (
            <div
              key={index}
              className="border rounded-xl p-5 shadow-sm bg-white"
            >
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs text-gray-500">
                  Appointment #{index + 1}
                </p>

                <StatusBadge
                  item={item}
                  cancelAppointment={cancelAppointment}
                />
              </div>

              <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                <img
                  src={item.userData?.image}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <p className="text-xs text-indigo-500 font-medium uppercase tracking-wide">
                    Patient
                  </p>

                  <p className="font-medium text-gray-800">
                    {item.userData?.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    Age {calculateAge(item.userData?.dob)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 pb-4 border-b border-gray-200">
                <img
                  src={item.docData?.image}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <p className="text-xs text-green-500 font-medium uppercase tracking-wide">
                    Doctor
                  </p>

                  <p className="font-medium text-gray-800">
                    {item.docData?.name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 text-sm pt-4">
                <div>
                  <p className="text-gray-500">Date</p>

                  <p className="font-medium">{slotDateFormat(item.slotDate)}</p>

                  <p className="text-xs text-gray-400">{item.slotTime}</p>
                </div>

                <div className="text-right">
                  <p className="text-gray-500">Fee</p>

                  <p className="font-semibold text-gray-800">
                    {currency} {item.amount}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =======================
   STAT CARD
======================= */

const StatCard = ({ title, value, color }) => {
  const styles = {
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      top: "border-t-2 md:border-t-4 border-indigo-600",
      title: "text-xs sm:text-sm text-indigo-700",
      value: "text-indigo-900",
      dot: "bg-indigo-600",
    },

    green: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      top: "border-t-2 md:border-t-4 border-emerald-600",
      title: "text-xs sm:text-sm text-emerald-700",
      value: "text-emerald-900",
      dot: "bg-emerald-600",
    },

    yellow: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      top: "border-t-2 md:border-t-4 border-amber-500",
      title: "text-xs sm:text-sm text-amber-700",
      value: "text-amber-900",
      dot: "bg-amber-500",
    },

    cyan: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      top: "border-t-2 md:border-t-4 border-cyan-600",
      title: "text-xs sm:text-sm text-cyan-700",
      value: "text-cyan-900",
      dot: "bg-cyan-600",
    },

    red: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      top: "border-t-2 md:border-t-4 border-rose-600",
      title: "text-xs sm:text-sm text-rose-700",
      value: "text-rose-900",
      dot: "bg-rose-600",
    },
  };

  const selected = styles[color];

  return (
    <div
      className={`relative rounded-2xl border p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${selected.bg} ${selected.border} ${selected.top}`}
    >
      <span
        className={`font-semibold uppercase tracking-widest ${selected.title}`}
      >
        {title}
      </span>

      <div className="flex items-end justify-between mt-4">
        <h2
          className={`text-2xl md:text-4xl font-bold tracking-tight ${selected.value}`}
        >
          {value}
        </h2>

        <span
          className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${selected.dot}`}
        />
      </div>
    </div>
  );
};
/* =======================
   STATUS BADGE
======================= */

const StatusBadge = ({ item, cancelAppointment }) => {
  const [day, month, year] = item.slotDate.split("_");

  // Convert "03:30 PM" -> 24-hour format
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
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">
        Cancelled
      </span>
    );
  }

  // Completed
  if (item.isCompleted) {
    return (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
        Completed
      </span>
    );
  }

  // Missed
  if (isMissed) {
    return (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-600">
        Missed
      </span>
    );
  }

  // Pending
  return (
    <button
      onClick={() => cancelAppointment(item._id)}
      className="px-5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-900 hover:bg-indigo-600 hover:text-white transition"
    >
      Cancel
    </button>
  );
};

export default AllAppointments;
