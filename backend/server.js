import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import adminRouter from "./routes/adminRoutes.js";
import doctorRouter from "./routes/doctorRoutes.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";

// ======================================================
// APP CONFIG
// ======================================================

const app = express();

const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

// ======================================================
// MIDDLEWARES
// ======================================================

app.use(express.json());

// ======================================================
// CORS
// ======================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",

  // Patient frontend
  process.env.FRONTEND_URL,

  // Admin + Doctor frontend
  process.env.ADMIN_URL,
].filter(Boolean);

console.log("Allowed CORS Origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin
      // such as Postman / server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true,
  }),
);

// ======================================================
// API ENDPOINTS
// ======================================================

app.use("/api/admin", adminRouter);

app.use("/api/doctor", doctorRouter);

app.use("/api/user", userRouter);

app.use("/api/chat", chatRouter);

// ======================================================
// TEST ROUTES
// ======================================================

app.get("/test", (req, res) => {
  res.send("Server Working");
});

app.get("/", (req, res) => {
  res.send("API Working great");
});

// ======================================================
// START SERVER
// ======================================================

app.listen(port, () => {
  console.log("Server is Started", port);
});
