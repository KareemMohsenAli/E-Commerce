import slugify from "slugify";
import cloudinary from "../../../utils/cloudinary.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import subCategoryModel from "../../../../DB/model/Subcategory.model.js";
import categoryModel from "../../../../DB/model/Category.model.js";
export const addSubCategory = async (req, res, next) => {
  const { name, categoryID } = req.body;
  const slug = slugify(name, {
    lower: true, // Convert to lowercase
    strict: true, // Replace special characters with "-"
  });
  const categoryExist = await categoryModel.findById(categoryID);
  if (!categoryExist) {
    return next(new Error("category not found", {
      cause: StatusCodes.CONFLICT,
    }));
  }
  const nameExist = await subCategoryModel.findOne({ name });
  if (nameExist) {
    return next(new Error("name is already exist",{
      cause: StatusCodes.CONFLICT,
    }));
  }
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `E-Commerce/SubCategory` }
  );
  const newCategory = await subCategoryModel.create({
    name,
    slug,
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
    return next(new Error("Subcategory not found", {
      cause: StatusCodes.CONFLICT,
    }));
  }
  if (name) {
    const checkName = await subCategoryModel.findOne({
      name,
      _id: { $ne: subCategoryId },
    });
    if (checkName) {
      return next(new Error("name is already exist",{
        cause: StatusCodes.CONFLICT,
      }));
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
export const deleteSubCategory = async (req, res, next) => {
  const { subCategoryId } = req.params;
  const deleteCategory = await subCategoryModel.findByIdAndDelete(
    subCategoryId
  );
  if (!deleteCategory) {
    return next(new Error("Subcategory not found", {
      cause: StatusCodes.CONFLICT,
    }));
  }
  await cloudinary.uploader.destroy(deleteCategory.image.public_id);
  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: "category deleted succefully", deleteCategory });
};
export const searchBynameSubCat = async (req, res, next) => {
  const { searchKey } = req.query;

  const findCategory = await subCategoryModel.find({
    name: { $regex: new RegExp(`${searchKey}`, "i") },
  });
  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: "Done", findCategory });
};

export const getAllSubCategories = async (req, res, next) => {
  console.log(req.params)
  const findCategory = await subCategoryModel.find(req.params).populate({path:"categoryID"});
  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: "Done", findCategory });
};

