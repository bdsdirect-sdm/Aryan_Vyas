import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Address extends Model {
  public id!: number;
  public userId!: number;
  public companyAddress!: string;
  public companyCity!: string;
  public companyState!: string;
  public companyZip!: string;
  public homeAddress!: string;
  public homeCity!: string;
  public homeState!: string;
  public homeZip!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Address.init({
  id: {    
    type: DataTypes.INTEGER.UNSIGNED, // Unsigned if needed
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED, // Unsigned if needed
    allowNull: false,
  },
  companyAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyCity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyState: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyZip: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  homeAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  homeCity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  homeState: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  homeZip: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'addresses',
});

export default Address;