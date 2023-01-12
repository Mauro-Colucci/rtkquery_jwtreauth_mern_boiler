import express from "express";
import { config } from "dotenv";
import path from "path";
import fileDirName from "./config/fileAndDirName.js";
import { logger, logEvents } from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/corsOprions.js";
import connectDB from "./config/connectDB.js";
import mongoose from "mongoose";
import rootRoute from "./routes/root.js";
import userRoutes from "./routes/users.js";
import noteRoutes from "./routes/notes.js";

config({ path: "./config/.env" });
const app = express();
const PORT = process.env.PORT || 3000;
const { __dirname } = fileDirName(import.meta);
connectDB();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", rootRoute);
app.use("/users", userRoutes);
app.use("/notes", noteRoutes);

//catch all
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
