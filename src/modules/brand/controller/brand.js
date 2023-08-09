import BrandModel from "../../../../DB/model/Brand.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from "slugify";
export const addBrand = async (req, res, next) => {
  const { name } = req.body;
  const slug = slugify(name);
  const nameExist = await BrandModel.findOne({ name });
  if (nameExist) {
   return  next(new Error("name is already exist",{ cause: StatusCodes.CONFLICT }));
  }
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `E-Commerce/brand` }
  );
  const addBrand = await BrandModel.create({
    name,
    slug,
    image: { public_id, secure_url },
  });
 return res.status(StatusCodes.CREATED).json({ message: "Done", addBrand });
};
export const updateBrand = async (req, res, next) => {
  const { name } = req.body;
  const { brandId } = req.params;

  const brand = await BrandModel.findById(brandId);
  if (!brand) {
    return next(new Error("brand not found",{ cause: StatusCodes.CONFLICT }));
  }
  if (name) {
    const nameIsExist = await BrandModel.findOne({ name, _id: { $ne: brandId } });
    if (nameIsExist) {
      return next(new Error("Name is already taken",{ cause: StatusCodes.CONFLICT }));
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
export const deleteBrand=async(req,res,next)=>{
    const {brandId}=req.params
    const fndBrandAndDelete = await BrandModel.findByIdAndDelete(
        brandId
      );
      if (!fndBrandAndDelete) {
        return next(new Error("brand not found", {
          cause: StatusCodes.CONFLICT,
        }));
      }
      await cloudinary.uploader.destroy(fndBrandAndDelete.image.public_id);
      return res
        .status(StatusCodes.OK)
        .json({ message: "brand deleted succefully", fndBrandAndDelete });
}
