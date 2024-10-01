import {Router} from "express"

import { userLogin, userSignup,userProfile ,updateProfile } from "../controllers/userController";

import { auth } from "../middlewares/authMiddleware";

const route = Router();

route.post("/signup", userSignup);
route.post('/login',userLogin);
route.get("/profile",auth, userProfile);
route.put("/updateProfile",auth,updateProfile);


export default route;