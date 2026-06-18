import { GoogleGenAI } from "@google/genai";
import { configDotenv } from "dotenv";
const ai = new GoogleGenAI(
    {
        apiKey: process.env.GOOGLE_GENAI_API_KEY
    }
)
const invokeGeminai = async (prompt) => {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return result.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate AI response");
  }
};
export default invokeGeminai