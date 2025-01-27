import sequelize from "../config/db";
import User from "./users";
import Preference from "./preference";
import Wave from "./waves";
import Comment from "./comments";
import Friend from "./friends";
import Admin from "./admin";

User.initModel(sequelize);
Preference.initModel(sequelize);
Wave.initModel(sequelize);
Comment.initModel(sequelize);
Friend.initModel(sequelize);
Admin.initModel(sequelize);

User.belongsTo(Admin, { foreignKey: "userId", as: "admin" });
Admin.hasMany(User, { foreignKey: "userId", as: "users" });

User.hasOne(Preference, { foreignKey: "userId", as: "preferences" });
User.hasMany(Wave, { foreignKey: "userId", as: "wave" });
User.hasMany(Comment, { foreignKey: "commenterId", as: "comments" });
User.hasMany(Friend, { foreignKey: "inviterId", as: "sentInvites" });


Friend.belongsTo(User, { foreignKey: "inviterId", as: "inviter" });

Preference.belongsTo(User, { foreignKey: "userId", as: "user" });

Comment.belongsTo(User, { foreignKey: "commenterId", as: "commenter" });
Comment.belongsTo(Wave, { foreignKey: "waveId", as: "wave" });

Wave.belongsTo(User, { foreignKey: "userId", as: "user" });
Wave.hasMany(Comment, { foreignKey: "waveId", as: "comments" });

export { sequelize, User, Preference, Wave, Comment, Friend, Admin };
