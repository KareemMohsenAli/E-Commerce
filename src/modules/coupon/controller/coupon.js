import { StatusCodes } from "http-status-codes"
import CouponModel from "../../../../DB/model/Coupon.js"
import { AppError } from "../../../utils/AppError.js"

export const addCoupon=async(req,res,next)=>{
    const {code,amount,expiredDate,numOfUses}=req.body
    const coupon=await CouponModel.findOne({code})
    if(coupon){
        return next( new AppError("coupon is already exist",StatusCodes.CONFLICT))
    }
    const addCoupon=await CouponModel.create({code,amount,expiredDate,numOfUses,createdBy:req.user._id})
     res.status(StatusCodes.CREATED).json({message:"Done",addCoupon})
}
export const deleteCopoun=async(req,res,next)=>{
    const {couponId}=req.params
    const findCoupon=await CouponModel.findByIdAndDelete(couponId)
   if(!findCoupon){
   return next(new AppError("coupon doesnt exist"))
   }
    return res.status(StatusCodes.OK).json({message:"done"})

}
