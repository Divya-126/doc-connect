import express from "express";

import {
  addDoctor,
  allDoctors,
  loginAdmin,
  changeAvailability,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  deleteDoctor,
  saveDoctorDraft,
  restoreDoctor,
} from "../controllers/adminController.js";

import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);

adminRouter.post("/login", loginAdmin);

adminRouter.get("/all-doctors", authAdmin, allDoctors);

adminRouter.post("/change-availability", authAdmin, changeAvailability);

adminRouter.get("/appointments", authAdmin, appointmentsAdmin);

adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);

adminRouter.get("/dashboard", authAdmin, adminDashboard);

adminRouter.put("/draft-doctor/:id", authAdmin, saveDoctorDraft);

adminRouter.put("/restore-doctor/:id", authAdmin, restoreDoctor);

adminRouter.delete("/delete-doctor/:id", authAdmin, deleteDoctor);

export default adminRouter;
