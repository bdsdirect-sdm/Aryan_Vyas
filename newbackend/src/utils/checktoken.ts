import jwt from "jsonwebtoken"

export const checkToken =(token:any) =>{
    try{
        const decode =  jwt.verify(token, process.env.SECREAT_KEY as string);
        if(!decode){
            return null;
        }
        else{
            return decode;
        }
    } catch(error){
       return null;
    }
}