import slugify from "slugify";
import cloudinary from "../../../utils/cloudinary.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import subCategoryModel from "../../../../DB/model/Subcategory.model.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import { AppError } from "../../../utils/AppError.js";
import { deletedOne, getallApiFeatures } from "../../../Refactors/Refactor.js";
export const addSubCategory = async (req, res, next) => {
  const { name, categoryID } = req.body;
  const userId=req.user._id
  const slug = slugify(name, {
    lower: true, // Convert to lowercase
    strict: true, // Replace special characters with "-"
  });
  const categoryExist = await categoryModel.findById(categoryID);
  if (!categoryExist) {
    return next(new AppError("category not found",StatusCodes.CONFLICT));
  }
  const nameExist = await subCategoryModel.findOne({ name });
  if (nameExist) {
    return next(new AppError("name is already exist",StatusCodes.CONFLICT));
  }
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `E-Commerce/SubCategory` }
  );
  const newCategory = await subCategoryModel.create({
    name,
    slug,
    userId,
    image: { public_id, secure_url },
    categoryID,
  });
  return res.status(StatusCodes.CREATED).json({ message: "Done", newCategory });
};
export const updateSubCategory = async (req, res, next) => {
  const { name } = req.body;
  const { subCategoryId } = req.params;
  const categoryIsExist = await subCategoryModel.findById(subCategoryId);
  if (!categoryIsExist) {
    return next(new AppError("Subcategory not found",StatusCodes.CONFLICT));
  }
  if (name) {
    const checkName = await subCategoryModel.findOne({
      name,
      _id: { $ne: subCategoryId },
    });
    if (checkName) {
      return next(new AppError("name is already exist",StatusCodes.CONFLICT));
    }
    categoryIsExist.name = name;
    categoryIsExist.slug = slugify(name);
  }
  if (req.file) {
    await cloudinary.uploader.destroy(categoryIsExist.image.public_id);

    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `E-Commerce/SubCategory`,
      }
    );
    categoryIsExist.image = { public_id, secure_url };
  }

  const updatedCategory = await categoryIsExist.save();
  return res.status(StatusCodes.ACCEPTED).json({
    message: "SubCategory updated successfully",
    updatedCategory,
  });
};
export const deleteSubCategory =deletedOne(subCategoryModel,"subCategory")
export const getAllSubCatgory = getallApiFeatures(subCategoryModel)
export const getAllSubCategories = async (req, res, next) => {
  console.log(req.params)
  const findCategory = await subCategoryModel.find(req.params).populate({path:"categoryID"});
  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: "Done", findCategory });
};

