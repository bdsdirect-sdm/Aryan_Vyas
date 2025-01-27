import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import User from './users';

interface FriendAttributes {
  id: number;
  inviterId: number;
  inviteEmail: string;
  inviteMessage?: string;
  inviteName?: string;
  status: 0 | 1;
  isAccepted: 0 | 1;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

type FriendCreationAttributes = Optional<
  FriendAttributes,
  'id' | 'inviteMessage' | 'inviteName' | 'status' | 'isAccepted' | 'deletedAt'
>;

class Friend
  extends Model<FriendAttributes, FriendCreationAttributes>
  implements FriendAttributes {
  public id!: number;
  public inviterId!: number;
  public inviteEmail!: string;
  public inviteMessage?: string;
  public inviteName?: string;
  public status!: 0 | 1;
  public isAccepted!: 0 | 1;
  public deletedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize) {
    Friend.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        inviterId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: User,
            key: 'id',
          },
        },
        inviteEmail: {
          type: DataTypes.STRING(100),
          allowNull: false,
          validate: {
            isEmail: true,
          },
        },
        inviteMessage: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        inviteName: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        status: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 0,
        },
        isAccepted: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 0,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'friends',
        timestamps: true,
        paranoid: true,
      }
    );
  }
}

export default Friend;
