import { StatusCodes } from "http-status-codes"
import productModel from "../../../../DB/model/Product.js"
import categoryModel from "../../../../DB/model/Category.model.js"
import subCategoryModel from "../../../../DB/model/Subcategory.model.js"
import BrandModel from "../../../../DB/model/Brand.js"
import slugify from "slugify"
import cloudinary from "../../../utils/cloudinary.js"

export const addNewProduct=async(req,res,next)=>{
    const isCategoryExist=await categoryModel.findById(req.body.categoryId)
    if(!isCategoryExist){
        return next(new Error("category is not found"))
    }
    const isSubCategoryExist=await subCategoryModel.findById(req.body.subCategoryId)
    if(!isSubCategoryExist){
        return next(new Error("subCategory is not found"))
    }
    const isBrandExist=await BrandModel.findById(req.body.brandId)
    if(!isBrandExist){
        return next(new Error("brand is not found"))
    }
    req.body.slug=slugify(req.body.name)
    req.body.stock=Number(req.body.quantity)
    req.body.paymentPrice=Number(req.body.price)-(Number(req.body.price)*(Number(req.body.discount||0)/100))
    const { public_id, secure_url } = await cloudinary.uploader.upload(
        req.files.image[0].path ,
        { folder: `E-Commerce/product/images` }
      );
      req.body.image= { public_id, secure_url }
      if(req.files.coverImages?.length){
        const coverImages=[]
        for (let i = 0; i<req.files.coverImages?.length; i++) {
            const { public_id, secure_url } = await cloudinary.uploader.upload(
                req.files.coverImages[i].path ,
                { folder: `E-Commerce/product/coverImages` }
              );

              coverImages.push({ public_id, secure_url})
            
        }
        req.body.coverImages=coverImages
        
      }
    if(req.body.size){
        req.body.size=JSON.parse(req.body.size)
    }
    if(req.body.colors){
        req.body.colors=JSON.parse(req.body.colors)
    }
    
  const product =await productModel.create(req.body)
  return res.status(StatusCodes.OK).json({ message: "Done", product });

}
const addProductStocks=async()=>{
    const isNameExist=await productModel.findOne({name:req.body.name})
    if(isNameExist){
        isNameExist.stock+=Number(req.body.quantity)
        await isNameExist.save()
        return res.status(StatusCodes.ACCEPTED).json({message:"Done",product:isNameExist})
    }

}