import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import invokeGeminai from './services/ai.service.js';
dotenv.config();
connectDB();

const response = await invokeGeminai(
  "Hello Gemini! Explain What is interview ?."
);

const PORT = process.env.PORT || 5000;
console.log(response)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
