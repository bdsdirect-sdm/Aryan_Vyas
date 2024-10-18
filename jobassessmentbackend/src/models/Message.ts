import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';

class Message extends Model {
    public id!: number;
    public roomId!: number;
    public senderId!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Message.init({
    roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    content:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'message',
    tableName: 'messages',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

export default Message;
