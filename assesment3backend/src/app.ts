import express, { Application, Request, Response } from "express"
import sequelize from './config/database';
import userRoutes from './routes/userRoutes';
import cors from "cors"
import bodyParser from "body-parser";
import dotenv from "dotenv";
const app:Application= express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json())


app.use(express.json());
app.use('../images', express.static('images'));
app.use('/api', userRoutes);

sequelize.sync({force:false})
.then(()=>{
    console.log("Database Syncronized successfully")
}).catch((error)=>{
    console.log("Db connection unsuccessfull with error :::::;", error);
})

export default app;