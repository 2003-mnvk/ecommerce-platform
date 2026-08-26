import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import errorMiddleware from "./middleware/errorMiddleware.js";
import ApiError from "./utils/ApiError.js";
import asyncHandler from "./utils/asyncHandler.js";
import testRoutes from "./routes/testRoutes.js"
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        status: true,
        message: "E-comemrce -v1 API is running successfully",
    });
});

// app.use("/api/v1/test",testRoutes);
app.use("/api/v1/auth",authRoutes);

app.use("/api/v1/users",userRoutes);

app.use("/api/v1/categories",categoryRoutes);

app.use(errorMiddleware);

export default app;
