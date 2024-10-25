import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Retailer extends Model {
    id: any;
    password: any;
}

Retailer.init({
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  companyName: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  address: DataTypes.STRING,
  companyLogo: DataTypes.STRING,
  profileImage: DataTypes.STRING,
  password: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'Retailer',
});

export default Retailer;
