import { StatusCodes } from "http-status-codes";
import { ApiFeatures } from "../utils/AppFeatures.js";
import { AppError } from "../utils/AppError.js";
import cloudinary from "../utils/cloudinary.js";
import productModel from "../../DB/model/Product.js";
//model as argument
export const getallApiFeatures = (Model) => {
  return async (req, res, next) => {
    let apiFeatures = new ApiFeatures(Model.find(), req.query)
      .pagination()
      .filter()
      .selectedFields()
      .search()
      .sort();
    

    let result = await apiFeatures.mongooseQuery;
    //get totalcounts
    const counts = await apiFeatures.getCounts();
    const metaData = {
      page: apiFeatures.page,
      totalDocuments: counts.totalDocuments,
      totalPages: counts.totalPages,
    };
    return res
      .status(StatusCodes.ACCEPTED)
      .json({ message: "Done", metaData, result });
  };
};

//model and name as argument
export const deletedOne = (Model, name) => {
  return async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    !document && next(new AppError(`${name} not found`, StatusCodes.CONFLICT));
    //if image exist
    if (document.image) {
      await cloudinary.uploader.destroy(document.image.public_id);
    }
    // if coverImages exist
    if (document.coverImages?.length) {
      for (let index = 0; index < document.coverImages?.length; index++) {
        await cloudinary.uploader.destroy(document.coverImages[index].public_id);
      }
    }
    //change response instead of document to write product,category...etc
    let changeDocument = {};
    changeDocument[name] = document;
    document &&res.status(StatusCodes.OK).json({ message: `${name} deleted succefully`, ...changeDocument });
  };
};
