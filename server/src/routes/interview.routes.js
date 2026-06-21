import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import {
  genInterviewReportcontroller,
  getInterviewReportById,
  getUserInterviewReports,
  getResumePdfController,
} from "../controllers/interview.controllers.js";
import { upload } from "../middlewares/file.middleware.js"

const Interviewrouter = express.Router();

Interviewrouter.post(
  "/",
  authUser,
  upload.single("resume"),
  genInterviewReportcontroller
);

Interviewrouter.get(
  "/",
  authUser,
  getUserInterviewReports
);

Interviewrouter.get(
  "/:interviewId",
  authUser,
  getInterviewReportById
);

Interviewrouter.get(
  "/:interviewId/resume",
  authUser,
  getResumePdfController
);

export default Interviewrouter;