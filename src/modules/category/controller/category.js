import slugify from "slugify";
import categoryModel from "../../../../DB/model/Category.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
export const addCategory = async (req, res, next) => {
  const { name } = req.body;
  const slug = slugify(name, {
    lower: true, // Convert to lowercase
    strict: true, // Replace special characters with "-"
  });
  const isExist = await categoryModel.findOne({ name });
  if (isExist) {
    return next(new Error("email is already exist"), {
      cause: StatusCodes.CONFLICT,
    });
  }
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `E-Commerce/category` }
  );
  const newCategory = await categoryModel.create({
    name,
    slug,
    image: { public_id, secure_url },
  });
  return res.status(StatusCodes.CREATED).json({ message: "Done", newCategory });
};
export const updateCategory = async (req, res, next) => {
  const { name } = req.body;
  const { categoryId } = req.params;
  const categoryIsExist = await categoryModel.findById(categoryId);
  if (!categoryIsExist) {
    return next(new Error("category not found"), {
      cause: StatusCodes.CONFLICT,
    });
  }
  const checkName = await categoryModel.findOne({
    name,
    _id: { $ne: categoryId },
  });
  if (checkName) {
    return next(new Error("name is already exist"), {
      cause: StatusCodes.CONFLICT,
    });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(categoryIsExist.image.public_id);

    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `E-Commerce/category`,
      }
    );
    categoryIsExist.image = { public_id, secure_url };
  }
  categoryIsExist.name = name;
  categoryIsExist.slug = slugify(name);
  const updatedCategory = await categoryIsExist.save();
  return res.status(StatusCodes.ACCEPTED).json({
    message: "Category updated successfully",
    updatedCategory,
  });
};
export const deleteCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const deleteCategory = await categoryModel.findByIdAndDelete(categoryId);
  if (!deleteCategory) {
    return next(new Error("category not found"), {
      cause: StatusCodes.CONFLICT,
    });
  }
  await cloudinary.uploader.destroy(deleteCategory.image.public_id)
  return res.status(StatusCodes.ACCEPTED).json({ message: "category deleted succefully", deleteCategory });
};
export const searchByname=async(req,res,next)=>{
    const {searchKey}=req.query
  
    const findCategory=await categoryModel.find({name:{$regex: new RegExp(`${searchKey}`,"i")}})
    return res.status(StatusCodes.ACCEPTED).json({ message: "Done", findCategory });

}

export const getAllCategoriesSubCategories=async(req,res,next)=>{
    const {categoryId}=req.params
    const categoryWithSubcategories = await categoryModel.findById(categoryId).populate('subcategories').catch((error) => {
        console.log('Population Error:', error);
      });
    return res.status(StatusCodes.OK).json({ message: "Done", categoryWithSubcategories });

}

