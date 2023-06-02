import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import userRoutes from './routes/user.js';
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit:'30mb',extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());

app.use('/users',userRoutes);


const PORT = process.env.PORT || 6001;
mongoose
    .connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>{
        app.listen(PORT,()=>{console.log(`Sever Port : ${PORT}`)});
    })
    .catch((err)=>{console.log(`${err} : Error Occurred`)});





