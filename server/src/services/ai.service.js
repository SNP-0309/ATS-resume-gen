import { GoogleGenAI } from "@google/genai";
import { configDotenv } from "dotenv";
import {z} from "zod"
import { zodToJsonSchema } from "zod-to-json-schema";
const ai = new GoogleGenAI(
    {
        apiKey: process.env.GOOGLE_GENAI_API_KEY
    }
)
const interviewReportSchema = z.object({
  technicalQuestion : z.array(z.object({
    question: z.string().description("Technical question would be asked in the interview."),
    intension: z.string().description("Intension of asking this type of questions on the interview."),
    answer:z.string().description("The answers of the given technical question asked in the interview.")

  }))
})

async function GenarateInterviewReport({resume,selfdescription,jobdescription}) {

  
}