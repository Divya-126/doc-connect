import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Appointments from "./pages/Appointments";
import ChatPage from "./pages/ChatPage";
import CallPage from "./pages/CallPage";
import ForgotPassword from "./pages/ForgotPassword";

import Layer from "./componenets/Layer";
import MiniLayer from "./componenets/MiniLayer";
import ProtectedRoute from "./componenets/ProtectedRoute";
import ScrollToTop from "./componenets/ScrollToTop"; // <-- Add this

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useContext } from "react";
import { AppContext } from "./context/AppContext";

const App = () => {
  const { token } = useContext(AppContext);

  return (
    <div className="mx-4 sm:mx-[10%]">
      <ScrollToTop /> {/* <-- Add this */}
      <Routes>
        <Route element={<Layer />}>
          <Route path="/" element={<Home />} />

          <Route path="/doctors" element={<Doctors />} />

          <Route path="/doctors/:speciality" element={<Doctors />} />

          <Route path="/login" element={<Login />} />
          <Route
            path="/forget-password"
            element={token ? <Navigate to="/" replace /> : <ForgotPassword />}
          />
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute token={token}>
                <MyProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute token={token}>
                <MyAppointments />
              </ProtectedRoute>
            }
          />

          <Route path="/appointments/:docId" element={<Appointments />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/about" element={<About />} />

          <Route
            path="/forget-password"
            element={token ? <Navigate to="/" replace /> : <ForgotPassword />}
          />
        </Route>

        <Route element={<MiniLayer />}>
          <Route
            path="/chat-user/:docId/:appId"
            element={
              <ProtectedRoute token={token}>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/call-user/:docId/:appId"
            element={
              <ProtectedRoute token={token}>
                <CallPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default App;
