import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';

class ChatRoom extends Model {
    public id!: number;
    public agencyId!: number;
    public userId!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

ChatRoom.init({
    agencyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    modelName: 'chatRoom',
    tableName: 'chat_rooms',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

export default ChatRoom;
