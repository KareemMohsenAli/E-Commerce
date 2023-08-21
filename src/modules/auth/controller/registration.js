import { StatusCodes } from "http-status-codes"
import userModel from "../../../../DB/model/User.model.js"
import { AppError } from "../../../utils/AppError.js"
import { compare, hash } from "../../../utils/HashAndCompare.js"
import cloudinary from "../../../utils/cloudinary.js"
import { Encryption } from "../../../utils/Encryption.js"
import { emailVerificationTamplete } from "../../../utils/HtmlVerivication.js"
import { nanoid } from "nanoid"
import sendEmail from "../../../utils/email.js"
import { generateToken } from "../../../utils/GenerateAndVerifyToken.js"
export const signUp=async(req,res,next)=>{
    const FindEmail=await userModel.findOne({email:req.body.email})
    if(FindEmail){
        return next(new AppError("email is already exist",StatusCodes.BAD_REQUEST))
    }
    req.body.phone=Encryption({encData:req.body?.phone})

    req.body.DOB=new Date( req.body.DOB);

   req.body.password= hash({plaintext:req.body?.password})
   if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `E-Commerce/userImage`,
      }
    );
    req.body.image = { public_id, secure_url };

  }
  const createCode=nanoid(6)
  req.body.code=createCode
  req.body.userName=req.body.userName
  // const link = `http://localhost:5000/auth/comfirmEmail`;
  await sendEmail({ to: req.body.email, html: emailVerificationTamplete(createCode),subject:"ComfrimEmail" })
  const user=await userModel.create(req.body) 
  return res.status(StatusCodes.CREATED).json({message:"Done",user})
}
export const confirmEmail=async(req,res,next)=>{
  const {code,email}=req.body
  const findUser=await userModel.findOne({email})
  if(!findUser){
    return next(new AppError("email not found",StatusCodes.BAD_REQUEST))
  }
  if(code!=findUser.code){
    return next(new AppError("invalid Code",StatusCodes.BAD_REQUEST))
  }
  const newCreateCode=nanoid(6)
  const updateUser =await userModel.updateOne({_id:findUser._id},{confirmEmail:true,code:newCreateCode})
  return res.json({message:"Done",updateUser})
}
export const signIn=async(req,res,next)=>{
  const user=await userModel.findOne({email:req.body.email})
  if(!user){
    return next(new AppError("invalid user information ",StatusCodes.BAD_REQUEST))
  }
  const match=compare({plaintext:req.body.password,hashValue:user.password})
  // console.log(typeof req.body.password)
  if(!match){
    return next(new AppError("invalid user information",StatusCodes.BAD_REQUEST))
  }
  const token=generateToken({userId:user._id,email:user.email})
  return res.status(StatusCodes.OK).json({message:"Done",token})
}
export const sendEmailPinforgetPassword=async(req,res,next)=>{
  const {email}=req.body
  const user=await userModel.findOne({email})
  if(!user){
    return next(new AppError("user not found",StatusCodes.BAD_REQUEST))
    
  }
  const generateNewCode=nanoid(6)
  user.code=generateNewCode
  await sendEmail({ to: user.email, html: emailVerificationTamplete(generateNewCode),subject:"forgetPassword" })
  await user.save()
  return res.json({message:"Done"})
}
export const forgetPassword=async(req,res,next)=>{
  const {email,code}=req.body
  const user=await userModel.findOne({email})
  if(!user){
    return next(new AppError("user not found",StatusCodes.BAD_REQUEST))
  }
  if(code!=user.code){
    return next(new AppError("invalid code",StatusCodes.BAD_REQUEST))

  } 
  const generateNewCode=nanoid(6)
  req.body.newPassword= hash({plaintext:req.body.newPassword})
  const changePassword=await userModel.updateOne({_id:user._id},{code:generateNewCode,password:req.body.newPassword})
  return res.json({message:"Done",changePassword})


}