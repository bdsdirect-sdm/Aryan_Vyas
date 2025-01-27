"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
    static initModel(sequelizeInstance) {
        User.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            first_name: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
            },
            last_name: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
            },
            email: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                // validate: {
                //     isEmail: true,
                // },
            },
            phone_number: {
                type: sequelize_1.DataTypes.STRING(15),
                allowNull: false,
                validate: {
                    isNumeric: true,
                    len: [10, 15],
                },
            },
            password: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            profileIcon: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            ssn: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            address1: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            address2: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            city: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            state: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            zip: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            dob: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: true,
            },
            gender: {
                type: sequelize_1.DataTypes.ENUM('Male', 'Female'),
                allowNull: true,
            },
            marital_status: {
                type: sequelize_1.DataTypes.ENUM('Married', 'Unmarried'),
                allowNull: true,
            },
            social: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            kids: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            // Adding status field
            status: {
                type: sequelize_1.DataTypes.ENUM('1', '2'), // 1 for active, 2 for inactive
                allowNull: false,
                defaultValue: '1', // Default to active (1)
            }
        }, {
            sequelize: sequelizeInstance,
            tableName: 'users',
            timestamps: true,
            paranoid: true,
        });
    }
}
exports.default = User;
