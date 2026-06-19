import pdfParse from "pdf-parse-new";
import GenarateInterviewReport from "../services/ai.service.js";
import interviewreportModel from "../models/interviewreport.model.js";

async function genInterviewReportcontroller(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required.",
      });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const resumecontent = pdfData.text;

    const { selfdescription, jobdescription } = req.body;

    const interviewReportbyAI = await GenarateInterviewReport({
      resume: resumecontent,
      selfdescription,
      jobdescription,
    });

    const interviewreport = await interviewreportModel.create({
      user: req.user.id,
      resume: resumecontent,
      selfDescription: selfdescription,
      jobDescription: jobdescription,
      ...interviewReportbyAI,
    });

    return res.status(201).json({
      message: "Interview Report generated successfully.",
      interviewreport,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
}

export default genInterviewReportcontroller;