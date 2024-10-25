import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Retailer from './Retailer';

class Product extends Model {
    name: any;
    category: any;
    quantity: any;
    price: any;
    status: any;
    image: string | undefined;
}

Product.init({
  name: DataTypes.STRING,
  category: DataTypes.STRING,
  image: DataTypes.STRING,
  quantity: DataTypes.INTEGER,
  price: DataTypes.FLOAT,
  status: DataTypes.STRING,
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Product',
  paranoid: true,
});

Product.belongsTo(Retailer, { foreignKey: 'retailerId' });
Retailer.hasMany(Product, { foreignKey: 'retailerId' });

export default Product;
