"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const users_1 = __importDefault(require("./users"));
class Friend extends sequelize_1.Model {
    static initModel(sequelize) {
        Friend.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            inviterId: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: users_1.default,
                    key: 'id',
                },
            },
            inviteEmail: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    isEmail: true,
                },
            },
            inviteMessage: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            inviteName: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: true,
            },
            status: {
                type: sequelize_1.DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 0,
            },
            isAccepted: {
                type: sequelize_1.DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 0,
            },
            deletedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'friends',
            timestamps: true,
            paranoid: true,
        });
    }
}
exports.default = Friend;
