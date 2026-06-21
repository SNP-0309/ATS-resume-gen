import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

const interviewReportSchema = {
  type: "object",
  properties: {
    matchScore: {
      type: "integer",
      description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description."
    },
    title: {
      type: "string",
      description: "The title of the job for which the interview report is generated."
    },
    optimizedResume: {
      type: "string",
      description: "An ATS-optimized professional resume in clean Markdown format tailored specifically to match the job description, using details from the user's resume and self description."
    },
    technicalQuestions: {
      type: "array",
      description: "Technical questions that can be asked in the interview along with their intention and how to answer them.",
      items: {
        type: "object",
        properties: {
          question: { type: "string", description: "The technical question." },
          intention: { type: "string", description: "The intention of the interviewer behind asking this question." },
          answer: { type: "string", description: "How to answer this question. Keep it simple, clear, and user-friendly. Avoid overly technical, complicated, or dense jargon." }
        },
        required: ["question", "intention", "answer"]
      }
    },
    behavioralQuestions: {
      type: "array",
      description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them.",
      items: {
        type: "object",
        properties: {
          question: { type: "string", description: "The behavioral question." },
          intention: { type: "string", description: "The intention of the interviewer behind asking this question." },
          answer: { type: "string", description: "How to answer this question. Keep it simple, clear, and user-friendly. Avoid overly technical, complicated, or dense jargon." }
        },
        required: ["question", "intention", "answer"]
      }
    },
    skillGaps: {
      type: "array",
      description: "List of skill gaps in the candidate's profile along with their severity.",
      items: {
        type: "object",
        properties: {
          skill: { type: "string", description: "The skill which the candidate is lacking." },
          severity: { type: "string", enum: ["low", "medium", "high"], description: "The severity of this skill gap." }
        },
        required: ["skill", "severity"]
      }
    },
    preparationPlan: {
      type: "array",
      description: "A day-wise preparation plan for the candidate to follow.",
      items: {
        type: "object",
        properties: {
          day: { type: "integer", description: "The day number, starting from 1." },
          focus: { type: "string", description: "The main focus of this day." },
          tasks: {
            type: "array",
            items: { type: "string" },
            description: "List of tasks to be done on this day."
          }
        },
        required: ["day", "focus", "tasks"]
      }
    }
  },
  required: ["matchScore", "title", "optimizedResume", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
};

async function GenarateInterviewReport({
  resume,
  selfdescription,
  jobdescription,
}) {
  const prompt = `You are an expert interview coach and career advisor. Generate a comprehensive interview report for a candidate based on their resume and the job description they are applying for. Also generate an optimized version of the resume tailored specifically to this job description.

IMPORTANT: All answers in the "technicalQuestions" and "behavioralQuestions" sections must be written using clear, simple, and user-understandable language. Avoid overly dense technical terms or complicated words. Explain concepts plainly so they are easy for any user to digest and remember.

Resume: ${resume}
Self Description: ${selfdescription}
Job Description: ${jobdescription}

Please provide the response in the following JSON format:
{
  "matchScore": <number between 0-100>,
  "title": "<job title>",
  "technicalQuestions": [
    {
      "question": "<question>",
      "intention": "<interviewer's intention>",
      "answer": "<how to answer in simple, user-friendly language>"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "<question>",
      "intention": "<interviewer's intention>",
      "answer": "<how to answer in simple, user-friendly language>"
    }
  ],
  "skillGaps": [
    {
      "skill": "<skill name>",
      "severity": "<low|medium|high>"
    }
  ],
  "preparationPlan": [
    {
      "day": <number>,
      "focus": "<focus area>",
      "tasks": ["<task1>", "<task2>"]
    }
  ],
  "optimizedResume": "<Your professionally written, ATS-friendly markdown resume. Highlight relevant skills and experience tailored to the target job description while maintaining truthfulness. Format it nicely with clear headings, lists, and spacing.>"
}`;

  try {
    let model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    let result;
    try {
      result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: interviewReportSchema,
        },
      });
    } catch (innerError) {
      console.warn("gemini-2.5-flash failed. Trying gemini-1.5-flash-latest fallback...", innerError);
      model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
      });
      result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: interviewReportSchema,
        },
      });
    }

    const response = result.response;
    const text = response.text();
    const jsonContent = JSON.parse(text);
    return jsonContent;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("Failed to generate interview report: " + error.message);
  }
}

export default GenarateInterviewReport;