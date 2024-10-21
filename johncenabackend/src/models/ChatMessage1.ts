// src/models/ChatMessage.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class ChatMessage extends Model {
    message: any;
}

ChatMessage.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'ChatMessage',
});

export default ChatMessage;
