import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dataBaseConnection from "./config/db.js";
import authRouter from "./routes/authRouter.js";
import blogRouter from "./routes/blogRouter.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// initialization
dotenv.config();
const app = express();

// middlewares

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());

// database connection
dataBaseConnection();

// routes
app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);

const PORT = process.env.PORT || 5000;

// Global error handling
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ success: false, message: "Something went wrong" });
});

// start server
app.listen(PORT, () => {
  console.log(`Server is started at PORT ${PORT}`);
});
