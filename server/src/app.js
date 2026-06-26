import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/auth.routes.js';
import Interviewrouter from './routes/interview.routes.js';
const app = express();
const allowedOrigins = [
  "https://resume-analyzer-gen.vercel.app",
  "http://localhost:5173",
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g. mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', router);
app.use('/api/interview',Interviewrouter)



export default app;