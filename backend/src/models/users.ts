    import { Model, DataTypes } from "sequelize";
    import sequelize from "../config/db";

    class User extends Model {
        public id!: number;
        public status!: number;  // 1 for active, 2 for inactive
        public first_name!: string;
        public last_name!: string;
        public email!: string;
        public phone_number!: string;
        public password!: string;
        public profileIcon?: string;
        public ssn?: number;
        public address1?: string;
        public address2?: string;
        public city?: string;
        public state?: string;
        public zip?: number;
        public dob?: Date;
        public gender?: 'Male' | 'Female';
        public marital_status?: 'Married' | 'Unmarried';
        public social?: string;
        public kids?: number;
        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
        public readonly deletedAt?: Date;

        public static initModel(sequelizeInstance: typeof sequelize) {
            User.init({
                id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true,
                },
                first_name: {
                    type: DataTypes.STRING(50),
                    allowNull: false,
                },
                last_name: {
                    type: DataTypes.STRING(50),
                    allowNull: false,
                },
                email: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                    unique: true,
                    // validate: {
                    //     isEmail: true,
                    // },
                },
                phone_number: {
                    type: DataTypes.STRING(15),
                    allowNull: false,
                    validate: {
                        isNumeric: true,
                        len: [10, 15],
                    },
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                profileIcon: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                ssn: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                address1: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                address2: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                city: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                state: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                zip: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                dob: {
                    type: DataTypes.DATEONLY,
                    allowNull: true,
                },
                gender: {
                    type: DataTypes.ENUM('Male', 'Female'),
                    allowNull: true,
                },
                marital_status: {
                    type: DataTypes.ENUM('Married', 'Unmarried'),
                    allowNull: true,
                },
                social: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                kids: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
                }
            }, {
                sequelize: sequelizeInstance,
                tableName: 'users',
                timestamps: true,
                paranoid: true,
            });
        }
    }

    export default User;
