"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Preference extends sequelize_1.Model {
    static initModel(sequelize) {
        Preference.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            language: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            breakfast: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            lunch: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            dinner: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            wakeTime: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            bedTime: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            weight: {
                type: sequelize_1.DataTypes.ENUM('Kg', 'lbs'),
                allowNull: true,
            },
            height: {
                type: sequelize_1.DataTypes.ENUM('cm', 'ft/inches'),
                allowNull: true,
            },
            bloodGlucose: {
                type: sequelize_1.DataTypes.ENUM('mmol/l', 'mg/dl'),
                allowNull: true,
            },
            cholesterol: {
                type: sequelize_1.DataTypes.ENUM('mmol/l', 'mg/dl'),
                allowNull: true,
            },
            bloodPressure: {
                type: sequelize_1.DataTypes.ENUM('kPa', 'mmHg'),
                allowNull: true,
            },
            distance: {
                type: sequelize_1.DataTypes.ENUM('km', 'miles'),
                allowNull: true,
            },
            systemEmails: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
            memberServiceEmails: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
            sms: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
            phoneCall: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
            post: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
        }, {
            sequelize,
            tableName: 'preferences',
            timestamps: true,
        });
    }
}
exports.default = Preference;
