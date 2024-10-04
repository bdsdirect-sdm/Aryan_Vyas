import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Address from './Address';

class User extends Model {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public profilePhoto!: string;
  public appointmentLetter!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED, // Unsigned if needed
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  profilePhoto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  appointmentLetter: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'users',
});

User.hasOne(Address, { foreignKey: 'userId' });
Address.belongsTo(User, { foreignKey: 'userId' });

export default User;