import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: "Password123#@!",
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false,
});

export default sequelize;
