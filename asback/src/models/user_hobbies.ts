import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class User extends Model {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public phone!: string;
    public gender!: 'male' | 'female' | 'other';
    public userType!: 'Job Seeker' | 'Agency';
    public password!: string;
    public profileImage?: string;
    public resume?: string;
    public agencyId?: number;
    public hobbies!: string[];
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
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
        validate: {
            isEmail: true,
        },
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
        },
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: false,
    },
    userType: {
        type: DataTypes.ENUM('Job Seeker', 'Agency'),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profileImage: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    resume: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    agencyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    hobbies: {
        type: DataTypes.JSON,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'users',
});


export default User;
