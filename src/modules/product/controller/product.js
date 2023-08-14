import { StatusCodes } from "http-status-codes";
import productModel from "../../../../DB/model/Product.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import subCategoryModel from "../../../../DB/model/Subcategory.model.js";
import BrandModel from "../../../../DB/model/Brand.js";
import slugify from "slugify";
import cloudinary from "../../../utils/cloudinary.js";
import { ApiFeatures } from "../../../utils/AppFeatures.js";
import { AppError } from "../../../utils/AppError.js";
import { deletedOne, getallApiFeatures } from "../../../Refactors/Refactor.js";

export const addNewProduct = async (req, res, next) => {
  const isNameExist = await productModel.findOne({ name: req.body.name });
  if (isNameExist) {
    isNameExist.stock += Number(req.body.quantity);
    await isNameExist.save();
    return res
      .status(StatusCodes.ACCEPTED)
      .json({ message: "Done", product: isNameExist });
  }
  const findDescription = await productModel.findOne({
    description: req.body.description,
  });
  findDescription &&
    next(
      new AppError("you should write unique description", StatusCodes.CONFLICT)
    );
  const isCategoryExist = await categoryModel.findById(req.body.categoryId);
  if (!isCategoryExist) {
    return next(new AppError("category is not found", StatusCodes.CONFLICT));
  }
  const isSubCategoryExist = await subCategoryModel.findById(
    req.body.subCategoryId
  );
  if (!isSubCategoryExist) {
    return next(new AppError("subCategory is not found", StatusCodes.CONFLICT));
  }
  const isBrandExist = await BrandModel.findById(req.body.brandId);
  if (!isBrandExist) {
    return next(new AppError("brand is not found", StatusCodes.CONFLICT));
  }
  req.body.slug = slugify(req.body.name);
  req.body.stock = Number(req.body.quantity);
  req.body.paymentPrice =
    Number(req.body.price) -
    Number(req.body.price) * (Number(req.body.discount || 0) / 100);
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.files.image[0].path,
    { folder: `E-Commerce/product/images` }
  );
  req.body.image = { public_id, secure_url };
  if (req.files.coverImages?.length) {
    const coverImages = [];
    for (let i = 0; i < req.files.coverImages?.length; i++) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        req.files.coverImages[i].path,
        { folder: `E-Commerce/product/coverImages` }
      );

      coverImages.push({ public_id, secure_url });
    }
    req.body.coverImages = coverImages;
  }
  if (req.body.size) {
    req.body.size = JSON.parse(req.body.size);
  }
  if (req.body.colors) {
    req.body.colors = JSON.parse(req.body.colors);
  }

  const product = await productModel.create(req.body);
  return res.status(StatusCodes.OK).json({ message: "Done", product });
};
export const updateProduct = async (req, res, next) => {
  const product = await productModel.findById(req.params.id);
  if (!product) {
    next(new AppError("product not found", StatusCodes.CONFLICT));
  }
  if (req.body.name) {
    const checkName = await productModel.findOne({
      name: req.body.name,
      _id: { $ne: req.params.id },
    });
    if (checkName) {
      return next(new AppError("name is already exist", StatusCodes.CONFLICT));
    }
    product.name = req.body.name;
    product.slug = slugify(req.body.name);
  }
  if (req.body.description) {
    const checkDescription = await productModel.findOne({
      description: req.body.description,
      _id: { $ne: req.params.id },
    });
    if (checkDescription) {
      return next(
        new AppError("description is already exist", StatusCodes.CONFLICT)
      );
    }
    product.description = req.body.description;
  }
  if (req.body.quantity) {
    product.stock = Number(req.body.quantity);
  }

  if (req.body.price) {
    product.price=req.body.price
    product.paymentPrice =
      Number(req.body.price) -
      Number(req.body.price) * (Number(req.body.discount || product.discount||0) / 100);
  }

  if (req.body.size) {
    product.size = JSON.parse(req.body.size);
  }
  if (req.body.colors) {
    product.colors = JSON.parse(req.body.colors);
  }

  if (req.files.image?.length) {
    await cloudinary.uploader.destroy(product.image.public_id);
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.files.image[0].path,
      { folder: `E-Commerce/product/images` }
    );
    product.image = { public_id, secure_url };
  }

  if (req.files.coverImages?.length) {
      //delete coverIamges if exist
    for (let index = 0; index < product.coverImages?.length; index++) {
      await cloudinary.uploader.destroy(product.coverImages[index].public_id);
    }
    // upload new coverImages
    const coverImages = [];
    for (let i = 0; i < req.files.coverImages?.length; i++) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        req.files.coverImages[i].path,
        { folder: `E-Commerce/product/coverImages` }
      );

      coverImages.push({ public_id, secure_url });
    }
    product.coverImages = coverImages;
  }

  const updatedproduct = await product.save();
  return res.status(StatusCodes.ACCEPTED).json({
    message: "product updated successfully",
    updatedproduct,
  });
};
export const deleteProduct=deletedOne(productModel,"product")

export const getallProduct = getallApiFeatures(productModel)

// export const getallProduct = async (req, res, next) => {
//   /////////////////////////////////////////////////////////////////////////pagination
//   // let pageNumber=req.query.page * 1||1
//   // if(pageNumber<=0) pageNumber=1
//   // const pageLimit=2
//   // const skip=(pageNumber -1)*pageLimit
//   /////////////////////////////////////////////////////////////////////////filter
//   //wite in url price[gte]=300
//   // let filterQuery={...req.query}
//   // const exclude=['page','searchKey','sort','fields','keyword']
//   // exclude.forEach((element)=>{
//   //   delete filterQuery[element]
//   // })
//   // filterQuery=JSON.stringify(filterQuery)
//   // filterQuery=filterQuery.replace(/\b(gt|gte|lt|lte)\b/g,match=>`$${match}`)
//   // filterQuery=JSON.parse(filterQuery)
//   // console.log(filterQuery)
//   //bulid query
//   // let mongoseQuery=productModel.find(filterQuery).skip(skip).limit(pageLimit);
//   /////////////////////////////////////////////////////////////////////////sort
//   // if(req.query.sort){
//   //   let sortedBy=req.query.sort.split(',').join(' ')
//   //   mongoseQuery.sort(sortedBy)
//   // }
//   /////////////////////////////////////////////////////////////////////////search
//   // if(req.query.searchKey){
//   //   mongoseQuery.find({$or:[{name:{$regex:req.query.searchKey,$options:'i'}},{description:{$regex:req.query.searchKey,$options:'i'}}]})
//   // }
//   /////////////////////////////////////////////////////////////////////////select speciic fields
//   // if(req.query.fields){
//   //   let fields=req.query.fields.split(',').join(' ')
//   //   mongoseQuery.select(fields)
//   // }
//   // let result =await mongoseQuery

//   let apiFeatures = new ApiFeatures(productModel.find(), req.query)
//     .pagination()
//     .filter()
//     .selectedFields()
//     .search()
//     .sort();
  
//   let result = await apiFeatures.mongooseQuery;

//   //get totalcounts
//   const counts = await apiFeatures.getCounts();

//   const metaData = {
//     page: apiFeatures.page,
//     totalDocuments: counts.totalDocuments,
//     totalPages: counts.totalPages,
//   };

//   return res
//     .status(StatusCodes.ACCEPTED)
//     .json({ message: "Done", metaData, result });
// };



