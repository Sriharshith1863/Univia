import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
})
);

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

import { errorHandler } from "./middlewares/errors.middlewares.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";
import eventRouter from "./routes/event.routes.js";
import ticketRouter from "./routes/ticket.routes.js";

app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/event", eventRouter);
app.use("/api/v1/ticket", ticketRouter);

app.use(errorHandler);
export { app };