import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/auth.routes.js';
import Interviewrouter from './routes/interview.routes.js';
const app = express();
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', router);
app.use('/api/interview',Interviewrouter)



export default app;