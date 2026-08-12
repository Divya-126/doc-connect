import { generateStreamToken } from "../lib/stream.js";

// stream token for user
export const getStreamTokenUser = async (req, res) => {
  try {
    const sUserToken = await generateStreamToken(req.body.userId);

    res.status(200).json({ sUserToken });
  } catch (error) {
    console.log("Error in getStreamTokenUser", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//stream token for doctor
export const getStreamTokenDoctor = async (req, res) => {
  try {
    const sDocToken = await generateStreamToken(req.doctorId);
    res.status(200).json({ sDocToken });
  } catch (error) {
    console.log("Error in getStreamTokenUser", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
