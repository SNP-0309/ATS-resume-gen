import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/auth.routes.js';
import Interviewrouter from './routes/interview.routes.js';
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', router);
app.use('/api/interview',Interviewrouter)



export default app;