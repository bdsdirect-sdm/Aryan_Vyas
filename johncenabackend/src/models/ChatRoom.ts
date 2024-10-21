import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class ChatRooms extends Model {
  public id!: number;
  public agencyId!: number;
  public jobseekerId!: number;
  public roomId!:string
}

ChatRooms.init(
  {
    agencyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
  
    },
    jobseekerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
  
    },
    roomId:{
      type: DataTypes.STRING,
      allowNull:false
    }
  },
  {
    sequelize,
    modelName: 'ChatRooms',
  }
);

export default ChatRooms;
