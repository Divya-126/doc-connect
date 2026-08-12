import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(false);

  const getDoctorsData = async () => {
    try {
      if (!backendUrl) {
        console.error("Backend URL missing");
        return;
      }

      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Doctor Fetch Error:", error);
      toast.error(error?.response?.data?.message || "Failed to load doctors");
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData({
          ...data.userData,
          address: data.userData.address || { line1: "", line2: "" },
          gender: data.userData.gender || "",
          dob: data.userData.dob || "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Not Authorized");
    }
  };

  const getStreamToken = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/chat/user-stream-token`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return data?.sUserToken;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Not Authorized");
      console.log(error?.response);
    }
  };

  const getAppointment = async (appId) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/get-appointment/${appId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return data?.appoinment;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Not Authorized");
      console.log(error?.response);
    }
  };

  const value = {
    doctors,
    currencySymbol,
    backendUrl,
    getDoctorsData,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
    getStreamToken,
    getAppointment,
  };

  useEffect(() => {
    if (backendUrl) {
      getDoctorsData();
    }
  }, [backendUrl]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      loadUserProfileData();
    } else {
      localStorage.removeItem("token");
      setUserData(false);
    }
  }, [token]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
