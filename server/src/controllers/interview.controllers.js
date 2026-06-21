import pdfParse from "pdf-parse-new";
import mammoth from "mammoth";
import PDFDocument from "pdfkit";
import GenarateInterviewReport from "../services/ai.service.js";
import interviewreportModel from "../models/interviewreport.model.js";

async function genInterviewReportcontroller(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required.",
      });
    }

    let resumecontent = "";
    if (
      req.file.mimetype === "application/pdf" ||
      req.file.originalname.endsWith(".pdf")
    ) {
      const pdfData = await pdfParse(req.file.buffer);
      resumecontent = pdfData.text;
    } else if (
      req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      req.file.mimetype === "application/msword" ||
      req.file.originalname.endsWith(".docx") ||
      req.file.originalname.endsWith(".doc")
    ) {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      resumecontent = result.value;
    } else {
      return res.status(400).json({
        message: "Unsupported file type. Please upload a PDF or DOCX file.",
      });
    }

    const { selfdescription, jobdescription } = req.body;

    const interviewReportbyAI = await GenarateInterviewReport({
      resume: resumecontent,
      selfdescription,
      jobdescription,
    });

    const userId = req.user.userId || req.user.id;

    // Map AI spelling "intention" to MongoDB schema spelling "intension"
    const mappedTechnical = (interviewReportbyAI.technicalQuestions || []).map(q => ({
      question: q.question,
      intension: q.intention || q.intension,
      answer: q.answer
    }));

    const mappedBehavioral = (interviewReportbyAI.behavioralQuestions || []).map(q => ({
      question: q.question,
      intension: q.intention || q.intension,
      answer: q.answer
    }));

    const interviewreport = await interviewreportModel.create({
      user: userId,
      resume: resumecontent,
      selfDescription: selfdescription,
      jobDescription: jobdescription,
      ...interviewReportbyAI,
      technicalQuestions: mappedTechnical,
      behavioralQuestions: mappedBehavioral,
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

async function getInterviewReportById(req, res) {
  try {
    const { interviewId } = req.params;
    const report = await interviewreportModel.findById(interviewId);

    if (!report) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    const userId = req.user.userId || req.user.id;
    if (report.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to view this report.",
      });
    }

    return res.status(200).json({
      message: "Interview Report fetched successfully.",
      data: report,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getUserInterviewReports(req, res) {
  try {
    const userId = req.user.userId || req.user.id;
    const reports = await interviewreportModel.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "User Interview Reports fetched successfully.",
      data: reports,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getResumePdfController(req, res) {
  try {
    const { interviewId } = req.params;
    const report = await interviewreportModel.findById(interviewId);

    if (!report) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    const userId = req.user.userId || req.user.id;
    if (report.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to view this report.",
      });
    }

    const resumeContent = report.optimizedResume || report.resume;

    // 0.6 inch margin = 43.2 points
    const doc = new PDFDocument({ margin: 43.2 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="resume-${interviewId}.pdf"`);

    doc.pipe(res);

    // Simple markdown cleaner helper to prevent raw tags from appearing in PDF
    const cleanMarkdown = (text) => {
      return text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Clean links: [text](url) -> text
        .replace(/\*\*([^*]+)\*\*/g, "$1")       // Clean bold: **text** -> text
        .replace(/\*([^*]+)\*/g, "$1")           // Clean italics: *text* -> text
        .replace(/`([^`]+)`/g, "$1")             // Clean inline code: `code` -> code
        .trim();
    };

    const lines = resumeContent.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Horizontal dividers "---"
      if (trimmed === "---") {
        doc.moveDown(0.2);
        doc.strokeColor("#cccccc").lineWidth(0.5).moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
        doc.moveDown(0.4);
        continue;
      }

      if (line.startsWith("# ")) {
        const cleaned = cleanMarkdown(line.replace("# ", ""));
        doc.font("Helvetica-Bold").fontSize(24).text(cleaned, { align: "center", paragraphGap: 8 });
      } else if (line.startsWith("## ")) {
        const cleaned = cleanMarkdown(line.replace("## ", "")).toUpperCase();
        doc.font("Helvetica-Bold").fontSize(14).text(cleaned, { paragraphGap: 6 });
      } else if (line.startsWith("### ")) {
        const cleaned = cleanMarkdown(line.replace("### ", ""));
        doc.font("Helvetica-Bold").fontSize(12).text(cleaned, { paragraphGap: 4 });
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        const cleaned = cleanMarkdown(line.substring(2));
        doc.font("Helvetica").fontSize(11).text("• " + cleaned, { indent: 12, paragraphGap: 3, lineGap: 3 });
      } else if (trimmed === "") {
        doc.moveDown(0.3);
      } else {
        const cleaned = cleanMarkdown(line);
        // If it looks like contact info, center align it
        const isContactInfo = cleaned.includes("|") || cleaned.includes("@example.com") || cleaned.includes("📧") || cleaned.includes("📱") || cleaned.includes("🔗");
        doc.font("Helvetica").fontSize(11).text(cleaned, { 
          align: isContactInfo ? "center" : "left",
          paragraphGap: 4, 
          lineGap: 3 
        });
      }
    }

    doc.end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
}

export {
  genInterviewReportcontroller,
  getInterviewReportById,
  getUserInterviewReports,
  getResumePdfController,
};
export default genInterviewReportcontroller;