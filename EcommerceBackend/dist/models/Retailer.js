"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Retailer extends sequelize_1.Model {
}
Retailer.init({
    firstName: sequelize_1.DataTypes.STRING,
    lastName: sequelize_1.DataTypes.STRING,
    companyName: sequelize_1.DataTypes.STRING,
    email: sequelize_1.DataTypes.STRING,
    phone: sequelize_1.DataTypes.STRING,
    address: sequelize_1.DataTypes.STRING,
    companyLogo: sequelize_1.DataTypes.STRING,
    profileImage: sequelize_1.DataTypes.STRING,
    password: sequelize_1.DataTypes.STRING,
}, {
    sequelize: db_1.default,
    modelName: 'Retailer',
});
exports.default = Retailer;
