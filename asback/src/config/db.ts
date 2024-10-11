import { Sequelize } from 'sequelize';
import dotenv from "dotenv"
dotenv.config();
const sequelize = new Sequelize("jobseeker", "root","Password123#@!", {
    host: "localhost",
    dialect: 'mysql',
});

export default sequelize;
