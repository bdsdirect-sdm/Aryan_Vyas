import User from "./userModel";

import sequelize from "../config/database";


const model = {
    User
}

const intializeSequelizer = async() =>{
    await sequelize.sync();
    console.log("Database is syncronize");
}

export default model;

export {intializeSequelizer};
