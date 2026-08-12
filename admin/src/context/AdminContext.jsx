import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [dashData, setDashData] = useState(false);

  // Sync token with localStorage
  useEffect(() => {
    if (aToken) {
      localStorage.setItem("aToken", aToken);
    } else {
      localStorage.removeItem("aToken");
    }
  }, [aToken]);

  // Get All Doctors
  const getAllDoctors = async () => {
    if (!aToken) return;

    try {
      const { data } = await axios.get(backendUrl + "/api/admin/all-doctors", {
        headers: { Authorization: `Bearer ${aToken}` },
      });

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Change Doctor Availability
  const changeAvailability = async (docId) => {
    if (!aToken) return;

    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId },
        {
          headers: { Authorization: `Bearer ${aToken}` },
        },
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Save Doctor Draft
  const saveDoctorDraft = async (id) => {
    if (!aToken) return;

    try {
      const { data } = await axios.put(
        backendUrl + `/api/admin/draft-doctor/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${aToken}` },
        },
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Restore Doctor
  const restoreDoctor = async (id) => {
    if (!aToken) return;

    try {
      const { data } = await axios.put(
        backendUrl + `/api/admin/restore-doctor/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${aToken}` },
        },
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Delete Doctor
  const deleteDoctor = async (id) => {
    if (!aToken) return;

    try {
      const { data } = await axios.delete(
        backendUrl + `/api/admin/delete-doctor/${id}`,
        {
          headers: { Authorization: `Bearer ${aToken}` },
        },
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Get All Appointments
  const getAllAppointments = async () => {
    if (!aToken) return;

    try {
      const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
        headers: { Authorization: `Bearer ${aToken}` },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Cancel Appointment
  const cancelAppointment = async (appointmentId) => {
    if (!aToken) return;

    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${aToken}` },
        },
      );

      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Get Dashboard Data
  const getDashData = async () => {
    try {
      if (!aToken) {
        toast.error("Admin not logged in");
        return;
      }

      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      });

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("aToken");
        setAToken("");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    deleteDoctor,
    saveDoctorDraft,
    restoreDoctor,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData,
    getDashData,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
