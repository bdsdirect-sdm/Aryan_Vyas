"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Address extends sequelize_1.Model {
}
Address.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED, // Unsigned if needed
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED, // Unsigned if needed
        allowNull: false,
    },
    companyAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    companyCity: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    companyState: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    companyZip: {
        type: sequelize_1.DataTypes.STRING(6),
        allowNull: false,
    },
    homeAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    homeCity: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    homeState: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    homeZip: {
        type: sequelize_1.DataTypes.STRING(6),
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    tableName: 'addresses',
});
exports.default = Address;
