import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../componenets/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointments = () => {
  const { docId } = useParams();

  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);

  const navigate = useNavigate();

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const [showLoginModal, setShowLoginModal] = useState(false);

  // Fetch Doctor
  const fetchDocInfo = () => {
    const foundDoctor = doctors.find((doc) => doc._id === docId);
    setDocInfo(foundDoctor);
  };

  // Break Time Check
  const isBreakTime = (time, breaks) => {
    return breaks.some((b) => {
      const start = new Date(`1970-01-01T${b.start}:00`);
      const end = new Date(`1970-01-01T${b.end}:00`);
      return time >= start && time < end;
    });
  };

  // Generate Slots
  const getAvailableSlots = () => {
    if (!docInfo) return;

    let allSlots = [];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date();
      currentDate.setDate(now.getDate() + i);

      const dayName = currentDate.toLocaleDateString("en-US", {
        weekday: "long",
      });

      const workingDay = docInfo.workingDays.find((d) => d.day === dayName);

      if (!workingDay) continue;

      const [startHour, startMinute] = workingDay.startTime
        .split(":")
        .map(Number);

      const [endHour, endMinute] = workingDay.endTime.split(":").map(Number);

      let startTime = new Date(currentDate);
      startTime.setHours(startHour, startMinute, 0, 0);

      let endTime = new Date(currentDate);
      endTime.setHours(endHour, endMinute, 0, 0);

      let timeSlots = [];

      while (startTime < endTime) {
        // Skip today's past slots
        if (currentDate.toDateString() === now.toDateString()) {
          if (startTime <= now) {
            startTime = new Date(startTime.getTime() + 30 * 60000);
            continue;
          }
        }

        const breakCheck = new Date(
          `1970-01-01T${startTime.toTimeString().slice(0, 5)}:00`,
        );

        if (!isBreakTime(breakCheck, workingDay.breaks)) {
          const formattedTime = startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          const slotDate = `${startTime.getDate()}_${
            startTime.getMonth() + 1
          }_${startTime.getFullYear()}`;

          const isSlotAvailable =
            !docInfo.slots_booked?.[slotDate] ||
            !docInfo.slots_booked[slotDate].includes(formattedTime);

          if (isSlotAvailable) {
            timeSlots.push({
              datetime: new Date(startTime),
              time: formattedTime,
            });
          }
        }

        startTime = new Date(startTime.getTime() + 30 * 60000);
      }

      if (timeSlots.length > 0) {
        allSlots.push(timeSlots);
      }
    }

    setDocSlots(allSlots);
  };
  // BOOK APPOINTMENT
  const bookAppointment = async () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    if (!slotTime) {
      toast.warning("Please select a time slot");
      return;
    }

    const date = docSlots[slotIndex][0].datetime;

    const slotDate = `${date.getDate()}_${
      date.getMonth() + 1
    }_${date.getFullYear()}`;

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        {
          docId,
          slotDate,
          slotTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  return (
    docInfo && (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Doctor Card */}

          <div className="bg-white rounded-2xl shadow-md p-6 md:p-10 flex flex-col md:flex-row gap-8">
            <div className="flex justify-center">
              <img
                className="w-60 h-60 object-cover rounded-2xl shadow-sm"
                src={docInfo.image}
                alt={docInfo.name}
              />
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
                {docInfo.name}
                <img className="w-5" src={assets.verified_icon} alt="" />
              </h2>

              <p className="text-gray-600 mt-2">
                {docInfo.degree} • {docInfo.speciality}
              </p>

              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                {docInfo.about}
              </p>

              <div className="mt-5">
                <span className="text-lg font-medium text-gray-800">
                  {currencySymbol} {docInfo.fees}
                </span>

                <span className="text-gray-500 text-sm ml-2">
                  Consultation Fee
                </span>
              </div>
            </div>
          </div>

          {/* Booking Section */}

          <div className="bg-white rounded-2xl shadow-md mt-10 p-6 md:p-10">
            <h3 className="text-xl font-semibold text-gray-800">
              Select Appointment Slot
            </h3>

            {/* Days */}

            <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
              {docSlots.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSlotIndex(index);
                    setSlotTime("");
                  }}
                  className={`min-w-[80px] py-4 rounded-xl text-center cursor-pointer transition-all duration-200 ${
                    slotIndex === index
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <p className="text-sm font-medium">
                    {daysOfWeek[item[0].datetime.getDay()]}
                  </p>

                  <p className="text-lg font-semibold">
                    {item[0].datetime.getDate()}
                  </p>
                </div>
              ))}
            </div>

            {/* Time Slots */}

            <div className="flex flex-wrap gap-3 mt-8">
              {docSlots[slotIndex]?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSlotTime(item.time)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    slotTime === item.time
                      ? "bg-blue-600 text-white shadow-md"
                      : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.time}
                </button>
              ))}
            </div>

            {/* Confirm Button */}

            <div className="mt-10">
              <button
                onClick={bookAppointment}
                className="w-full md:w-auto bg-blue-600 text-white px-10 py-3 rounded-xl font-medium text-lg shadow-md hover:bg-blue-700 hover:scale-[1.02] active:scale-100 transition-all duration-200"
              >
                Confirm Appointment
              </button>
            </div>
          </div>
          {/* Related Doctors */}

          <div className="mt-16">
            <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
          </div>
        </div>

        {/* Login Modal */}

        {showLoginModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-3xl w-[90%] max-w-md p-8 shadow-2xl animate-fadeIn">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-4xl">🔒</span>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-center mt-6">
                Login Required
              </h2>

              <p className="text-gray-500 text-center mt-3">
                Please login to book your appointment with the doctor.
              </p>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                >
                  Skip
                </button>

                <button
                  onClick={() =>
                    navigate("/login", {
                      state: {
                        from: `/appointments/${docId}`,
                      },
                    })
                  }
                  className="flex-1 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default Appointments;
