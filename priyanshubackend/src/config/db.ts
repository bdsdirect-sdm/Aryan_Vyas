import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('shopping_db', 'root', 'Password123#@!', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;
