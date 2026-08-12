import { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { DoctorContext } from "../../context/DocterContext";

const DoctorDashboard = () => {
  const {
    dToken,
    dashData,
    getDashData,
    cancelAppointment,
    completeAppointment,
  } = useContext(DoctorContext);

  const { slotDateFormat, currency } = useContext(AppContext);

  // Refresh every minute
  const [, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  return (
    dashData && (
      <div className="m-2 md:m-5">
        <div className="flex flex-wrap gap-1 md:gap-3">
          <div className="flex items-center gap-2 bg-white p-4 md:min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-8 md:w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-sm md:text-xl font-semibold text-gray-600">
                {currency} {dashData.earnings}
              </p>
              <p className="text-sm md:text-lg text-gray-400">Earnings</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 md:min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-8 md:w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-sm md:text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-sm md:text-lg text-gray-400">Patients</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 md:min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img
              className="w-8 md:w-14"
              src={assets.appointments_icon}
              alt=""
            />
            <div>
              <p className="text-sm md:text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-sm md:text-lg text-gray-400">Appointments</p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-4 md:mt-10 rounded-t border">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Bookings</p>
          </div>

          <div className="md:pt-4 border border-t-0 md:max-h-[70vh] max-h-[55vh] overflow-y-auto">
            {dashData.latestAppointments.slice(0, 5).map((item, index) => {
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

              const appointmentEnd = new Date(appointmentStart);
              appointmentEnd.setMinutes(appointmentEnd.getMinutes() + 30);

              const now = new Date();

              const isMissed =
                now > appointmentEnd && !item.isCompleted && !item.cancelled;

              return (
                <div
                  key={index}
                  className="flex items-center px-6 py-3 gap-3 hover:bg-sky-50"
                >
                  <img
                    className="rounded-full aspect-square object-cover max-w-16 md:max-w-20"
                    src={item.userData.image}
                    alt=""
                  />

                  <div className="flex-1 text-sm">
                    <p className="text-gray-800 font-medium">
                      {item.userData.name}
                    </p>

                    <p className="text-gray-600">
                      Booking on {slotDateFormat(item.slotDate)}
                    </p>
                  </div>
                  {item.cancelled ? (
                    <p className="text-red-400 text-xs font-medium">
                      Cancelled
                    </p>
                  ) : item.isCompleted ? (
                    <p className="text-green-500 text-xs font-medium">
                      Completed
                    </p>
                  ) : isMissed ? (
                    <p className="text-orange-500 text-xs font-semibold">
                      Missed
                    </p>
                  ) : (
                    <div className="flex">
                      <img
                        onClick={() => cancelAppointment(item._id)}
                        className="w-10 cursor-pointer"
                        src={assets.cancel_icon}
                        alt=""
                      />

                      <img
                        onClick={() => completeAppointment(item._id)}
                        className="w-10 cursor-pointer"
                        src={assets.tick_icon}
                        alt=""
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
