import slugify from "slugify";
import categoryModel from "../../../../DB/model/Category.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { AppError } from "../../../utils/AppError.js";
import { deletedOne, getallApiFeatures } from "../../../Refactors/Refactor.js";

export const addCategory = async (req, res, next) => {
  const { name } = req.body;
  const slug = slugify(name, {
    lower: true, // Convert to lowercase
    strict: true, // Replace special characters with "-"
  });
  const isExist = await categoryModel.findOne({ name });
  if (isExist) {
    return next(new AppError("email is already exist",StatusCodes.CONFLICT));
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
  const { id } = req.params;
  const categoryIsExist = await categoryModel.findById(id);
  if (!categoryIsExist) {
    return next(new AppError("category not found",StatusCodes.CONFLICT));
  }

  if (name) {
    const checkName = await categoryModel.findOne({
      name,
      _id: { $ne: categoryId },
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
        folder: `E-Commerce/category`,
      }
    );
    categoryIsExist.image = { public_id, secure_url };
  }

  const updatedCategory = await categoryIsExist.save();
  return res.status(StatusCodes.ACCEPTED).json({
    message: "Category updated successfully",
    updatedCategory,
  });
};
export const deleteCategory = deletedOne(categoryModel,"category")
export const getAllCategories =getallApiFeatures(categoryModel)

export const getAllCategoriesSubCategories = async (req, res, next) => {
  const { id } = req.params;
  const categoryWithSubcategories = await categoryModel
    .findById(id)
    .populate("subcategories")
    .catch((error) => {
      console.log("Population Error:", error);
    });
  return res
    .status(StatusCodes.OK)
    .json({ message: "Done", categoryWithSubcategories });
};
