import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { MessageSquareDiff } from "lucide-react";

const MyAppointments = () => {
  const navigate = useNavigate();
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState("");

  const months = [
    " ",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const [day, month, year] = slotDate.split("_");
    return `${day} ${months[Number(month)]} ${year}`;
  };

  // Getting User Appointments Data Using API
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Function to cancel appointment Using API
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    console.log("Initializing Razorpay", order);
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,

      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verifyRazorpay",
            response,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (data.success) {
            getUserAppointments();
            navigate("/my-appointments");
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // // Function to make payment using razorpay
  const appointmentRazorpay = async (appointmentId) => {
    console.log("Calling payment API", appointmentId);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay",
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("API RESPONSE:", data);
      if (data.success) {
        initPay(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 text-lg font-medium text-gray-600   border-b">
        My appointments
      </p>
      <div className="max-h-[70vh] overflow-y-auto  pr-2">
        {appointments.map((item, index) => {
          const [day, month, year] = item.slotDate.split("_");

          const appointmentStart = new Date(
            `${year}-${month}-${day} ${item.slotTime}`,
          );

          // Appointment duration = 30 minutes
          const appointmentEnd = new Date(appointmentStart);
          appointmentEnd.setMinutes(appointmentEnd.getMinutes() + 30);

          const now = new Date();

          const isMissed =
            now > appointmentEnd && !item.cancelled && !item.isCompleted;

          const canChat =
            now >= appointmentStart &&
            now <= appointmentEnd &&
            !item.cancelled &&
            !item.isCompleted;

          return (
            <div
              key={index}
              className="grid border-gray-400  grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
            >
              <div className="relative ">
                <img
                  className="w-40 h-40 object-cover bg-blue-100"
                  src={item.docData.image}
                  onClick={() => {
                    navigate(`/appointments/${item._id}`);
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: "smooth",
                    });
                  }}
                />
                {canChat && (
                  <Link
                    to={`/chat-user/${item.docData._id}/${item._id}`}
                    className="absolute top-0 text-xs flex items-center justify-center gap-2 p-2 bg-slate-100 "
                  >
                    <MessageSquareDiff className="size-4 text-indigo-600" />
                  </Link>
                )}
              </div>

              <div className=" flex-1 text-sm text-[#5E5E5E]">
                <p className="text-[#262626] text-base font-semibold">
                  {item.docData.name}
                </p>
                <p>{item.docData.speciality}</p>

                <p className="text-[#464646] font-medium mt-1">Address:</p>
                <p>{item.docData.address.line1}</p>
                <p>{item.docData.address.line2}</p>

                <p className="mt-1">
                  <span className="text-sm text-[#3C3C3C] font-medium">
                    Date & Time:
                  </span>{" "}
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>
              <div></div>
              <div className="flex flex-col gap-2 justify-end text-sm text-center">
                {!item.cancelled &&
                  !item.payment &&
                  !item.isCompleted &&
                  !isMissed &&
                  payment !== item._id && (
                    <button
                      onClick={() => setPayment(item._id)}
                      className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      Pay Online
                    </button>
                  )}
                {!item.cancelled &&
                  !item.payment &&
                  !item.isCompleted &&
                  !isMissed &&
                  payment === item._id && (
                    <button
                      onClick={() => {
                        console.log("Button clicked");
                        appointmentRazorpay(item._id);
                      }}
                      className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center"
                    >
                      <img
                        className="max-w-20 max-h-5"
                        src={assets.razorpay_logo}
                        alt=""
                      />
                    </button>
                  )}
                {!item.cancelled &&
                  item.payment &&
                  !item.isCompleted &&
                  !isMissed && (
                    <button className="sm:min-w-48 py-2 border rounded text-[#696969]  bg-[#EAEFFF]">
                      Paid
                    </button>
                  )}

                {item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                    Completed
                  </button>
                )}

                {isMissed && (
                  <button className="sm:min-w-48 py-2 border border-yellow-500 rounded bg-yellow-50 text-yellow-600 font-medium cursor-default">
                    Appointment Missed
                  </button>
                )}

                {!item.cancelled && !item.isCompleted && !isMissed && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                  >
                    Cancel appointment
                  </button>
                )}
                {item.cancelled && !item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                    Appointment cancelled
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyAppointments;
