import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import ChatRooms from './ChatRoom';
import ChatMessages from './ChatMessage';

class Userdetails extends Model {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public password!: string;
    public gender!: string;
    public contact!: string;
    public role!: number;
    public resume!:string | null;
    public hobbies!:string
    public isLoggedIn!:boolean
    public profileImg!:string | null;
    public agencyId!: number | null;
    public isApproved!: boolean | null;
    
}

Userdetails.init(
    {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hobbies: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contact: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        resume: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        profileImg: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        agencyId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
          },
        
    },
    {
        sequelize,
        modelName: 'Userdetails',
    }
);

Userdetails.hasMany(Userdetails, { foreignKey: 'agencyId', as: 'JobSeekers' });
Userdetails.belongsTo(Userdetails, { foreignKey: 'agencyId', as: 'Agency' }); 

// --------------------------------------------


// Userdetails.hasMany(ChatRooms, { foreignKey: 'agencyId', as: 'ChatRoomsAsAgency' });
// Userdetails.hasMany(ChatRooms, { foreignKey: 'jobseekerId', as: 'ChatRoomsAsJobSeeker' });

// ChatRooms.belongsTo(Userdetails, { foreignKey: 'agencyId', as: 'Agency' });
// ChatRooms.belongsTo(Userdetails, { foreignKey: 'jobseekerId', as: 'JobSeeker' });

// ChatRooms.hasMany(ChatMessages, { foreignKey: 'chatRoomId' });
// ChatMessages.belongsTo(ChatRooms, { foreignKey: 'chatRoomId' });

// Userdetails.hasMany(ChatMessages, { foreignKey: 'senderId' });
// ChatMessages.belongsTo(Userdetails, { foreignKey: 'senderId' });


export default Userdetails;