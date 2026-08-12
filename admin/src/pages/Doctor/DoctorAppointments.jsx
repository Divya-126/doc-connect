import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeInfo, MessageSquareDiff } from "lucide-react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { DoctorContext } from "../../context/DocterContext";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
  } = useContext(DoctorContext);

  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  // Force re-render every minute so appointment status updates automatically.
  const [, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (dToken) getAppointments();
  }, [dToken]);

  return (
    <div>
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border flex flex-col md:shadow-[0_0_18px_#c0bfbf] rounded-lg text-sm max-h-[80vh] overflow-y-scroll px-1 md:px-0 gap-2 md:gap-0">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p className="pl-4">Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.map((item, index) => {
          const [day, month, year] = item.slotDate.split("_");

          // Convert "03:30 PM" into 24-hour time
          const [time, period] = item.slotTime.split(" ");

          let [hours, minutes] = time.split(":").map(Number);

          if (period === "PM" && hours !== 12) {
            hours += 12;
          }

          if (period === "AM" && hours === 12) {
            hours = 0;
          }

          // Create appointment start time
          const appointmentStart = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            hours,
            minutes,
            0,
          );

          // Appointment ends after 30 minutes
          const appointmentEnd = new Date(appointmentStart);
          appointmentEnd.setMinutes(appointmentEnd.getMinutes() + 30);

          const now = new Date();

          // Show chat icon only during appointment
          const canMessage = now >= appointmentStart && now <= appointmentEnd;

          // Show missed after appointment ends
          const isMissed =
            now > appointmentEnd && !item?.isCompleted && !item?.cancelled;

          console.log({
            slotDate: item.slotDate,
            slotTime: item.slotTime,
            appointmentStart,
            appointmentEnd,
            now,
            canMessage,
            isMissed,
          });

          return (
            <div
              key={index}
              className="flex flex-wrap justify-between rounded-lg md:rounded-none max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 shadow-[0_0_8px_#8f8e8e] md:shadow-none md:border-b hover:bg-sky-50 hover:border-blue-200 transition-all duration-200"
            >
              <p className="max-sm:hidden">{index + 1}</p>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <img
                    src={item.userData.image}
                    className="aspect-square rounded-full max-w-14 md:max-w-20 object-cover"
                    alt="User"
                  />

                  {!item?.isCompleted && !item?.cancelled && canMessage && (
                    <Link
                      to={`/doctor-chat/${item.userId}`}
                      className="absolute -top-2 -right-4"
                    >
                      <div className="relative group">
                        <span className="absolute px-2 py-1 pointer-events-none rounded-full text-xs flex gap-1 bg-green-200/70 border border-green-300 w-[130px] items-center justify-center text-green-600 left-full ml-1.5 mt-1 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <BadgeInfo className="size-3" />
                          Message Patient
                        </span>

                        <MessageSquareDiff className="size-5 text-blue-400 group-hover:text-indigo-500" />
                      </div>
                    </Link>
                  )}
                </div>

                <p>{item.userData.name}</p>
              </div>

              <div>
                <p className="text-xs inline border border-primary px-2 rounded-full">
                  {item.payment ? "Online" : "CASH"}
                </p>
              </div>

              <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>

              <p>
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>

              <p>
                {currency}
                {item.amount}
              </p>

              {item.cancelled ? (
                <p className="text-red-500 text-xs font-medium ml-auto md:ml-0">
                  Cancelled
                </p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-medium ml-auto md:ml-0">
                  Completed
                </p>
              ) : isMissed ? (
                <p className="text-orange-500 text-xs font-semibold ml-auto md:ml-0">
                  Missed
                </p>
              ) : (
                <div className="flex ml-auto md:ml-0">
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt="Cancel"
                  />
                  <img
                    onClick={() => completeAppointment(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.tick_icon}
                    alt="Complete"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorAppointments;
