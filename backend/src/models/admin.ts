import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";

class Admin extends Model {
  public id!: number;
  public adminEmail!: string;
  public adminPassword!: string;
  public adminFullName!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelizeInstance: typeof sequelize) {
    Admin.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        adminEmail: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        adminPassword: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        adminFullName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize: sequelizeInstance,
        tableName: "admin",
        timestamps: true,
      }
    );
  }
}

export default Admin;
