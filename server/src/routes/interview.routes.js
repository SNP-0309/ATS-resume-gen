import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import genInterviewReportcontroller from "../controllers/interview.controllers.js";
import { upload } from "../middlewares/file.middleware.js"

const Interviewrouter = express.Router();

Interviewrouter.post(
  "/",
  authUser,
  upload.single("resume"),
  genInterviewReportcontroller
);

export default Interviewrouter;