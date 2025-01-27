import { DataTypes, Model, Sequelize, Optional } from "sequelize";
import sequelize from "../config/db";
import User from '../models/users';
import Wave from '../models/waves';

interface CommentAttributes {
  id: number;
  commenterId: number;
  waveId: number;
  comment: string;
  status: 0 | 1;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CommentCreationAttributes extends Optional<CommentAttributes, 'id'> {}

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id!: number;
  public commenterId!: number;
  public waveId!: number;
  public comment!: string;
  public status!: 0 | 1;
  public deletedAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public commenter?: User;
  public wave?: Wave;

  public static initModel(sequelizeInstance: Sequelize) {
    Comment.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        commenterId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        waveId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: "waves",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        comment: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: [1, 1000],
          },
        },
        status: {
          type: DataTypes.TINYINT,
          allowNull: true,
          defaultValue: 1, // 1 for active, 0 for inactive
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize: sequelizeInstance,
        tableName: "comments",
        timestamps: true,
        paranoid: true, // Soft delete enabled
      }
    );
  }
}

export default Comment;
