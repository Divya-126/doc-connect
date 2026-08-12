import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const MiniLayer = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default MiniLayer;
