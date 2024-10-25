import express from 'express';
import retailerRoutes from './routes/retailer';
import productRoutes from './routes/product';
import sequelize from './config/db';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/retailers', retailerRoutes);
app.use('/api/products', productRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
});
export default app;