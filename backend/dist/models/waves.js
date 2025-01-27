"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Wave extends sequelize_1.Model {
    static initModel(sequelizeInstance) {
        Wave.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            image: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            message: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [1, 500],
                },
            },
            status: {
                type: sequelize_1.DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 0,
            },
        }, {
            sequelize: sequelizeInstance,
            tableName: "waves",
            timestamps: true,
        });
    }
}
exports.default = Wave;
