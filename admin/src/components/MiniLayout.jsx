import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const MiniLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default MiniLayout;
