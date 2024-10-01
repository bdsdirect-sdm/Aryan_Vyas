import { DataTypes, Model } from "sequelize";

import sequelize from "../config/dbconnect";

class UserDetail extends Model {
    public firstName! : string;
    public lastName! : string;
    public email! : string;
    public password! : string;
}

UserDetail.init(
    {
        firstName:{
            type: DataTypes.STRING,
            allowNull:false
        },
        lastName:{
            type: DataTypes.STRING,
            allowNull:true
        },
        email:{
            type: DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        password:{
            type: DataTypes.STRING,
            allowNull:false
        },
    },
    {
        sequelize,
        tableName:"userDetails"
    }
)

export default UserDetail;