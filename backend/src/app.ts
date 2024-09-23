import express, { Application } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import sequelize from './config/database';
import cors from 'cors';
 
const app: Application = express();
app.use (cors());
app.use(bodyParser.json());
app.use('/users', userRoutes);
 
sequelize.sync().then(() => console.log('Database synced'));
 
export default app;