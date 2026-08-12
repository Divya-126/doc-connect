import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";

import { AdminContext } from "./context/AdminContext.jsx";
import { DoctorContext } from "./context/DocterContext.jsx";

import Login from "./pages/Login.jsx";

import ForgotPassword from "./pages/ForgetPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

import Dashboard from "./pages/Admin/Dashboard.jsx";
import AllAppointments from "./pages/Admin/AllAppointments.jsx";
import AddDoctor from "./pages/Admin/AddDoctor.jsx";
import DoctorsList from "./pages/Admin/DoctorsList.jsx";

import DoctorDashboard from "./pages/Doctor/DoctorDashboard.jsx";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments.jsx";
import DoctorProfile from "./pages/Doctor/DoctorProfile.jsx";

import ChatPage from "./pages/Doctor/ChatPage.jsx";
import CallPage from "./pages/Doctor/CallPage.jsx";

import Layout from "./components/Layout.jsx";
import MiniLayout from "./components/MiniLayout.jsx";

const App = () => {
  const { aToken } = useContext(AdminContext);

  const { dToken } = useContext(DoctorContext);

  return (
    <>
      <Routes>
        {/* ==================================================
            LOGIN
        ================================================== */}

        <Route
          path="/"
          element={
            aToken ? (
              <Navigate to="/admin-dashboard" replace />
            ) : dToken ? (
              <Navigate to="/doctor-dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/login"
          element={
            aToken ? (
              <Navigate to="/admin-dashboard" replace />
            ) : dToken ? (
              <Navigate to="/doctor-dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

        {/* ==================================================
            FORGOT PASSWORD
        ================================================== */}

        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ==================================================
            RESET PASSWORD
            
        ================================================== */}

        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ==================================================
            ADMIN
        ================================================== */}

        {aToken && (
          <Route element={<Layout />}>
            <Route path="/admin-dashboard" element={<Dashboard />} />

            <Route path="/all-appointments" element={<AllAppointments />} />

            <Route path="/add-doctor" element={<AddDoctor />} />

            <Route path="/doctor-list" element={<DoctorsList />} />
          </Route>
        )}

        {/* ==================================================
            DOCTOR
        ================================================== */}

        {dToken && (
          <Route element={<Layout />}>
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

            <Route
              path="/doctor-appointments"
              element={<DoctorAppointments />}
            />

            <Route path="/doctor-profile" element={<DoctorProfile />} />
          </Route>
        )}

        {/* ==================================================
            CHAT / CALL
        ================================================== */}

        <Route element={<MiniLayout />}>
          <Route
            path="/doctor-chat/:userId"
            element={dToken ? <ChatPage /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/doctor-call/:userId"
            element={dToken ? <CallPage /> : <Navigate to="/login" replace />}
          />
        </Route>

        {/* ==================================================
            FALLBACK
        ================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to={
                aToken
                  ? "/admin-dashboard"
                  : dToken
                    ? "/doctor-dashboard"
                    : "/login"
              }
              replace
            />
          }
        />
      </Routes>

      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
};

export default App;
