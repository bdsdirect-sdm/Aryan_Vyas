import express, { Application, Request, Response } from "express"

import UserRoute from "./routes/userRoute"

import bodyParser from "body-parser";

import sequelize from "./config/dbconnect";

import cors from "cors"

const app:Application= express();

import dotenv from "dotenv"

dotenv.config();
app.use(cors());
app.use(bodyParser.json())

app.use("/user", UserRoute)

sequelize.sync({force:false})
.then(()=>{
    console.log("Database Syncronized successfully")
}).catch((error)=>{
    console.log("Db connection unsuccessfull with error :::::;", error);
})

export default app;