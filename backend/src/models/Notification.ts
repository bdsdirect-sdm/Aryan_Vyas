import sequelize from "../config/db";
import { Model,DataTypes } from "sequelize";
import { v4 as UUIDV4 } from "uuid";
import User from "./User";

class Notification extends Model{
    public notification!:any;
}

Notification.init({
    uuid: {
        type:DataTypes.UUID,
        defaultValue:UUIDV4,
        primaryKey:true,
        allowNull:false,
        },
    senderId:{
        type:DataTypes.UUID,
        allowNull:false
    },
    notification:{
        type:DataTypes.STRING,
        allowNull:false
        },
},{
    sequelize,
    modelName:"Notification"
})
User.hasMany(Notification,{foreignKey:"senderId"});
Notification.belongsTo(User,{foreignKey:"senderId"});
