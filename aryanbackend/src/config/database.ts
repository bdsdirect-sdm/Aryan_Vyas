import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('johncena', 'root', 'Password123#@!', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

export default sequelize;