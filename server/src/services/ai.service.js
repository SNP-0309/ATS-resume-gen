import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

async function GenarateInterviewReport({
  resume,
  selfdescription,
  jobdescription,
}) {
  const prompt = `You are an expert interview coach and career advisor. Generate a comprehensive interview report for a candidate based on their resume and the job description they are applying for.

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
      "answer": "<how to answer>"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "<question>",
      "intention": "<interviewer's intention>",
      "answer": "<how to answer>"
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
  ]
}`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(interviewReportSchema),
      },
    });

    const response = result.response;
    const text = response.text();
    const jsonContent = JSON.parse(text);
    return jsonContent;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("Failed to generate interview report: " + error.message);
  }
}

export default GenarateInterviewReport