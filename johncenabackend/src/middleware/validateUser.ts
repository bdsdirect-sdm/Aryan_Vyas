import { profile } from "console"
import Joi from "joi"
// import { httpStatusCodes } from "../../constants"
export const validateUser =(req:any,res:any,next:any)=>{
    const validateUserSchema=Joi.object({
        firstName:Joi.string().required(),
        lastName:Joi.string().required(),
        email:Joi.string().email().required(),
        gender:Joi.string().required(),
        hobbies:Joi.string().required(),
        contact:Joi.string().required().max(10).min(10),
        role:Joi.number().required(),
        agencyId:Joi.string(),
        profileImg:Joi.string(),
        resume:Joi.string(),
        
    })
    const {firstName, lastName, email, gender, contact,hobbies, role, profileImg} = req.body
    // const {error}=validateUserSchema.validate(req.body)
    const {error}=validateUserSchema.validate({firstName, lastName, email, gender, contact, hobbies,role, profileImg})
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        // console.log(msg)
        return res.status(409).json({message:msg})
    }
    next()
}
