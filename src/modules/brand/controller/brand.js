import BrandModel from "../../../../DB/model/Brand.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from "slugify";
import { AppError } from "../../../utils/AppError.js";
import { deletedOne, getallApiFeatures } from "../../../Refactors/Refactor.js";

export const addBrand = async (req, res, next) => {
  const { name } = req.body;
  const userId=req.user._id
  const slug = slugify(name);
  const nameExist = await BrandModel.findOne({ name });
  if (nameExist) {
   return  next(new AppError("name is already exist",StatusCodes.CONFLICT));
  }
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `E-Commerce/brand` }
  );
  const addBrand = await BrandModel.create({
    name,
    slug,
    userId,
    image: { public_id, secure_url },
  });
 return res.status(StatusCodes.CREATED).json({ message: "Done", addBrand });
};
export const updateBrand = async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;
 

  const brand = await BrandModel.findById(id);
  if (!brand) {
    return next(new AppError("brand not found",StatusCodes.CONFLICT));
  }
  if (name) {
    const nameIsExist = await BrandModel.findOne({ name, _id: { $ne: id } });
    if (nameIsExist) {
      return next(new AppError("Name is already taken",StatusCodes.CONFLICT));
    }
    brand.name = name;
    brand.slug = slugify(name);
  }
  if (req.file) {
    await cloudinary.uploader.destroy(brand.image.public_id);
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `E-Commerce/brand` }
    );
    brand.image = { public_id, secure_url };
  }
  const updatedBrand = await brand.save();
  return res.status(StatusCodes.OK).json({ message: "brand updated successfully", updatedBrand });
};
export const deleteBrand=deletedOne(BrandModel,"Brand")
export const getAllBrand=getallApiFeatures(BrandModel)