import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRouter from './users/userRoute.js';
import eventRouter from './events/eventRoute.js';
import stripeRouter from './events/stripeRoute.js';

dotenv.config();
const app = express();
connectDB();

// Body parser middleware
app
  .use('/api/webhook', stripeRouter)
  .use(express.json());
  
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:3000',
}));

// Cookie parser middleware
app.use(cookieParser());

app.use('/api/users', userRouter);
app.use('/api/events', eventRouter);

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});