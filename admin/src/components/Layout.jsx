import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden bg-[#F8F9FD]">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
