import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';

class User extends Model {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public phone!: string;
    public gender!: 'Male' | 'Female' | 'Other';
    public userType!: '1' | '2';
    public hobbies?: string[];
    public profileImage?: string;
    public password!: string;
    public resumeFile?: string;
    public agencyId?: number;
    public status?: 'pending' | 'accepted' | 'rejected';
}

User.init({
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
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
    },
    userType: {
        type: DataTypes.ENUM('1', '2'),
        allowNull: false,
    },
    hobbies: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resumeFile: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    agencyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
    },
}, {
    sequelize,
    modelName: 'user',
    tableName: 'user',
});

export default User;
