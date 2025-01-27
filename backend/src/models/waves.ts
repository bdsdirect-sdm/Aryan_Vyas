import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";

class Wave extends Model {
  public id!: number;
  public userId!: number;
  public image?: string;
  public message!: string;
  public status!: 0 | 1;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelizeInstance: typeof sequelize) {
    Wave.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        message: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: [1, 500],
          },
        },
        status: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize: sequelizeInstance,
        tableName: "waves",
        timestamps: true,
      }
    );
  }
}

export default Wave;
