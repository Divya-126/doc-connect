import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";

import App from "./App.jsx";

import "react-toastify/dist/ReactToastify.css";
import "stream-chat-react/dist/css/v2/index.css";

import DoctorContextProvider from "./context/DocterContext.jsx";
import AdminContextProvider from "./context/AdminContext.jsx";
import AppContextProvider from "./context/AppContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvider>
      <DoctorContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </DoctorContextProvider>
    </AdminContextProvider>
  </BrowserRouter>,
);
