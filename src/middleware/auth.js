import jwt from "jsonwebtoken";
import userModel from "../../DB/model/User.model.js";
import { AppError } from "../utils/AppError.js";

export const auth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.BEARER_KEY)) {
            return res.json({ message: "In-valid bearer key" })
        }
        const token = authorization.split(process.env.BEARER_KEY)[1]
        if (!token) {
            return res.json({ message: "In-valid token" })
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
        if (!decoded?.id) {
            return res.json({ message: "In-valid token payload" })
        }
        const authUser = await userModel.findById(decoded.id).select('-password')
        if (!authUser) {
            return res.json({ message: "Not register account" })
        }
        if (!authUser.confirmEmail) {
            return res.json({ message: "Not activated account" })
        }
        req.user = authUser;
        return next()
    } catch (error) {
        return res.json({ message: "Catch error" , err:error?.message })
    }
}

export const authorization=(roles=[])=>{
    return async(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError("you're not authorization to access this enPoint"))
        }else{
            return next()
        }
    
    }
}
