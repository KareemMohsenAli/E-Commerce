import { Router } from "express";
import * as brandContoller from "./controller/brand.js";
import { validation } from "../../middleware/validation.js";
import {
  addBrandVal,
  deleteBrandVal,
  updateBrandVal,
} from "./brand.validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { asyncHandler } from "../../utils/errorHandling.js";

const router = Router();

router.post(
  "/",
  fileUpload(fileValidation.image).single("image"),
  validation(addBrandVal),
  asyncHandler(brandContoller.addBrand)
);

router.put(
  "/:id",
  fileUpload(fileValidation.image).single("image"),
  validation(updateBrandVal),
  asyncHandler(brandContoller.updateBrand)
);

router.delete(
  "/:id",
  validation(deleteBrandVal),
  asyncHandler(brandContoller.deleteBrand)
);

router.get("/", asyncHandler(brandContoller.getAllBrand));

export default router;
