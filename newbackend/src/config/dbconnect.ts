import  {Sequelize} from "sequelize"
import dotenv from "dotenv"
import { dot } from "node:test/reporters";

dotenv.config();

const sequelize = new Sequelize("project2", "root","Password123#@!",{
    host : "localhost",
    dialect: "mysql"
} )

export default sequelize;