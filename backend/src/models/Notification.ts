import { Model, DataTypes } from 'sequelize';
import sequelize from "../config/db";
import User from './User';

class Notifications extends Model {
  public id!: number;
  public receiverId!: string;
  public senderId!: string;
  public notifications!: string;
}

Notifications.init(
  {
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false,
    
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    notifications: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isSeen:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'Notifications',
  }
);

User.hasMany(Notifications, { foreignKey: "senderId" });
Notifications.belongsTo(User, { foreignKey: "senderId"});

export default Notifications;
