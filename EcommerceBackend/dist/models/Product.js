"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const Retailer_1 = __importDefault(require("./Retailer"));
class Product extends sequelize_1.Model {
}
Product.init({
    name: sequelize_1.DataTypes.STRING,
    category: sequelize_1.DataTypes.STRING,
    image: sequelize_1.DataTypes.STRING,
    quantity: sequelize_1.DataTypes.INTEGER,
    price: sequelize_1.DataTypes.FLOAT,
    status: sequelize_1.DataTypes.STRING,
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize: db_1.default,
    modelName: 'Product',
    paranoid: true,
});
Product.belongsTo(Retailer_1.default, { foreignKey: 'retailerId' });
Retailer_1.default.hasMany(Product, { foreignKey: 'retailerId' });
exports.default = Product;
