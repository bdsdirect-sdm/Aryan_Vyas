import express, { Request, Response } from 'express';
import sequelize from '../src/config/db'
import User from './models/User';
import UserRoutes from './routes/UserRoutes';
import cors from 'cors'
const app = express();
app.use(cors())


app.use(express.json());
const PORT = process.env.PORT || 4001;


app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.use('/api', UserRoutes);

const startServer = async () => {
    try {
      await sequelize.sync({alter: true});
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  };
  
  startServer();