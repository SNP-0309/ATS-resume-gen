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
  const prompt = `You are an expert interview coach, ATS resume specialist, and career advisor. Your task is to analyze the candidate's resume and generate a comprehensive, fully personalized interview preparation report.

=== CANDIDATE DATA ===
Resume Content:
${resume}

Self Description: ${selfdescription}

Target Job Description: ${jobdescription}

=== STRICT RULES — MUST FOLLOW ===
1. NEVER use placeholder text like [Your Name], [Your Email], [Company Name], [Your Degree], [City], [Date], or any bracketed placeholders anywhere in your response.
2. Extract the candidate's REAL name, email, phone, LinkedIn, GitHub, location, education, experience, and skills DIRECTLY from the Resume Content above.
3. The optimizedResume must contain ONLY the candidate's actual information from the resume. Do not invent or fabricate any details.
4. If a piece of information is genuinely not present in the resume, simply omit that field — do NOT insert a placeholder for it.
5. All answers in technicalQuestions and behavioralQuestions must be written in clear, simple, friendly language — no dense jargon.
6. The optimizedResume must be a complete, professional, ATS-optimized Markdown resume using ONLY the real data extracted from the resume above, rewritten and tailored to the target job description.

Please provide the response in the following JSON format:
{
  "matchScore": <number between 0-100>,
  "title": "<job title from the job description>",
  "technicalQuestions": [
    {
      "question": "<relevant technical question>",
      "intention": "<what the interviewer wants to assess>",
      "answer": "<how to answer in simple, user-friendly language>"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "<behavioral question>",
      "intention": "<what the interviewer wants to assess>",
      "answer": "<how to answer in simple, user-friendly language>"
    }
  ],
  "skillGaps": [
    {
      "skill": "<missing skill name>",
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
  "optimizedResume": "<A complete ATS-optimized professional resume in clean Markdown format. Use ONLY the candidate's REAL information extracted from the resume above — their actual name, actual contact details, actual experience, actual projects, actual education, actual skills. Tailor the content to match the job description. NO placeholders allowed.>"
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
      console.warn("gemini-2.5-flash failed. Trying gemini-2.0-flash-lite fallback...", innerError);
      model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-lite",
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