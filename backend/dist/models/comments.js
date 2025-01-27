"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Comment extends sequelize_1.Model {
    static initModel(sequelizeInstance) {
        Comment.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            commenterId: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            waveId: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: "waves",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            comment: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [1, 1000],
                },
            },
            status: {
                type: sequelize_1.DataTypes.TINYINT,
                allowNull: true,
                defaultValue: 1, // 1 for active, 0 for inactive
            },
            deletedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
        }, {
            sequelize: sequelizeInstance,
            tableName: "comments",
            timestamps: true,
            paranoid: true, // Soft delete enabled
        });
    }
}
exports.default = Comment;
