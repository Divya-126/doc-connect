import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  getStreamTokenDoctor,
  getStreamTokenUser,
} from "../controllers/chatController.js";
import authDoctor from "../middlewares/authDoctor.js";

const chatRouter = express.Router();

chatRouter.get("/user-stream-token", authUser, getStreamTokenUser);
chatRouter.get("/doctor-stream-token", authDoctor, getStreamTokenDoctor);

export default chatRouter;
