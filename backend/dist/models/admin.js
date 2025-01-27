"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Admin extends sequelize_1.Model {
    static initModel(sequelizeInstance) {
        Admin.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            adminEmail: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            adminPassword: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            adminFullName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
        }, {
            sequelize: sequelizeInstance,
            tableName: "admin",
            timestamps: true,
        });
    }
}
exports.default = Admin;
