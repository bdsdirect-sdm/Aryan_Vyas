import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('assessment6A', 'root', 'khalid@123', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

export default sequelize;