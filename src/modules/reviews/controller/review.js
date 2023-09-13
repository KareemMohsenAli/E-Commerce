// import { request } from "express";
// import orderModel from "../../../../DB/model/Order.model.js";
// import productModel from "../../../../DB/model/Product.model.js";
// import { ErrorClass } from "../../../utils/errorClass.js";
// import { asyncHandler } from "../../../utils/errorHandling.js";
// import reviewModel from "../../../../DB/model/Review.model.js"


// export const createReview = asyncHandler( async(req,res,next)=>{
//     const {productId,rating,comment}=req.body;

//     const isReview= await reviewModel.findOne({
//         productId,
//         createdBy:req.user._id
//     })
   
//     if(isReview){
//         return next(new ErrorClass("you can't review this product again",404))
//     }

//     const product= await productModel.findById(productId)
//     if(!product){
//         return next(new ErrorClass("product not found",404))
//     }

//     const order= await orderModel.findOne({
//         userId: req.user._id,
//         status:"delivered",
//         "products.product.productId":productId
//     })
//     if(!order){
//         return next(new ErrorClass("you can't review this product",404))
//     }
//     // create review
//    const review = await reviewModel.create({
//     productId,
//     rating,
//     comment,
//     createdBy: req.user._id
//    })
//    // udate product for avg

//    let oldAvg = product.avgRate
// //    console.log(oldAvg);
//    let oldNo = product.rateNo
// //    console.log(oldNo);
//    let sum = (oldAvg * oldNo) + rating
// //    console.log(sum);
//    let newAvg= sum / (oldNo + 1 )
// //    console.log(newAvg);
//    product.avgRate= newAvg
//    product.rateNo= oldNo + 1
//    await product.save()

//    return res.status(200).json({message:"done",review})
// } )


// export const updateReview = asyncHandler( async(req,res,next)=>{
//     const {reviewId}=req.params
//     const {rating,comment}=req.body;

//     const isReview= await reviewModel.findOne({
//         _id:reviewId,
//         createdBy:req.user._id
//     })
   
//     if(!isReview){
//         return next(new ErrorClass("review not found",404))
//     }

//    if (rating) {
//     isReview.rating = rating
//     const product = await productModel.findById(isReview.productId)
//     product.avgRate=((product.avgRate * product.rateNo - isReview.rating) + rating) / product.rateNo
//     await product.save();   
//     }
   
//    if (comment) {
//     isReview.comment = comment
//    }
//    await isReview.save()

//    return res.status(200).json({message:"done",isReview})
// } )



// export const deleteReview = asyncHandler( async(req,res,next)=>{
//     const {reviewId}=req.params

//     const isReview= await reviewModel.findOneAndDelete({
//         _id:reviewId,
//         createdBy:req.user._id
//     })
   
//     if(!isReview){
//         return next(new ErrorClass("review not found",404))
//     }

//     const product = await productModel.findById(isReview.productId)
//     product.avgRate=((product.avgRate * product.rateNo - isReview.rating))/ (product.rateNo - 1)
//     product.rateNo= product.rateNo - 1
//     await product.save();   

   
//    return res.status(200).json({message:"done",isReview})
// } )