import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");

  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);
  const [appointments, setAppointments] = useState([]);

  // ======================================================
  // GET CURRENT AUTH HEADER
  // ======================================================

  const getAuthHeader = () => {
    const token = localStorage.getItem("dToken") || dToken;

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ======================================================
  // HANDLE AUTH ERROR
  // ======================================================

  const handleAuthError = (error) => {
    console.error("Doctor API Error:", error);

    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status === 401) {
      localStorage.removeItem("dToken");
      setDToken("");

      toast.error(message || "Session expired. Please login again.");

      return;
    }

    toast.error(message || "Something went wrong");
  };

  // ======================================================
  // GET APPOINTMENTS
  // ======================================================

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/appointments`,
        getAuthHeader(),
      );

      if (data.success) {
        setAppointments(data.appointments || []);
      } else {
        toast.error(data.message || "Unable to get appointments");
      }
    } catch (error) {
      handleAuthError(error);
    }
  };

  // ======================================================
  // COMPLETE APPOINTMENT
  // ======================================================

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        {
          appointmentId,
        },
        getAuthHeader(),
      );

      if (data.success) {
        toast.success(data.message || "Appointment completed");

        await getAppointments();
      } else {
        toast.error(data.message || "Unable to complete appointment");
      }
    } catch (error) {
      handleAuthError(error);
    }
  };

  // ======================================================
  // CANCEL APPOINTMENT
  // ======================================================

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        {
          appointmentId,
        },
        getAuthHeader(),
      );

      if (data.success) {
        toast.success(data.message || "Appointment cancelled");

        await getAppointments();
      } else {
        toast.error(data.message || "Unable to cancel appointment");
      }
    } catch (error) {
      handleAuthError(error);
    }
  };

  // ======================================================
  // GET DASHBOARD DATA
  // ======================================================

  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/dashboard`,
        getAuthHeader(),
      );

      console.log("Doctor dashboard response:", data);

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message || "Unable to get dashboard data");
      }
    } catch (error) {
      console.error("Dashboard error response:", error?.response?.data);

      handleAuthError(error);
    }
  };

  // ======================================================
  // GET DOCTOR PROFILE
  // ======================================================

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/profile`,
        getAuthHeader(),
      );

      console.log("Doctor profile response:", data);

      if (data.success) {
        setProfileData(data.profileData);
      } else {
        toast.error(data.message || "Unable to get profile");
      }
    } catch (error) {
      handleAuthError(error);
    }
  };

  // ======================================================
  // GET STREAM TOKEN
  // ======================================================

  const getStreamToken = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/chat/doctor-stream-token`,
        getAuthHeader(),
      );

      return data?.sDocToken;
    } catch (error) {
      handleAuthError(error);
      return null;
    }
  };

  // ======================================================
  // CONTEXT VALUE
  // ======================================================

  const value = {
    getStreamToken,

    dToken,
    setDToken,

    backendUrl,

    appointments,
    setAppointments,

    getAppointments,
    completeAppointment,
    cancelAppointment,

    dashData,
    setDashData,
    getDashData,

    profileData,
    setProfileData,
    getProfileData,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
