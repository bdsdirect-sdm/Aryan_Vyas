import {Sequelize} from "sequelize";

const sequelize = new Sequelize("users", "root", "Password123#@!", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;
