import express, { Application } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// var cookieParser = require('coockie-parser')

// IMPORTING ROUTES
import AuthRoute from './Routes/AuthRoute.js';
import userRoute from './Routes/UserRoute.js';
import BlogsRoute from './Routes/BlogsRoute.js';

const app: Application = express();

// MIDDLEWARES
app.use(cors({
    credentials: true,
    origin: ['http://127.0.0.1:5500', 'https://aldot.netlify.app']
}));
app.use(bodyParser.json({ limit: '30mb'}));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cookieParser())

dotenv.config();

const CONNECTION: string | undefined = process.env.MONGODB_URL;
const PORT: string | undefined = process.env.PORT;

if (!CONNECTION || !PORT) {
    throw new Error('MongoDB URL or Port is not defined in the environment variables.');
}

mongoose.connect(CONNECTION)
    .then(() => app.listen(PORT, () => console.log(`Database Connected to port: ${PORT}`)))
    .catch((error: Error) => console.error(error));

app.use('/auth', AuthRoute);
app.use('/user', userRoute);
app.use('/blog', BlogsRoute);