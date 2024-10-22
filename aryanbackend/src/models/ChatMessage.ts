import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class ChatMessages extends Model {
  public id!: number;
  public chatRoomId!: number;
  public senderId!: number;
  public message!: string;
}

ChatMessages.init(
  {
    chatRoomId: {
      type: DataTypes.STRING,
      allowNull: false,
    
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ChatMessages',
  }
);

export default ChatMessages;
