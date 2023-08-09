import { Router } from "express";
import * as productController from "./controller/product.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import { addProductVal } from "./product.validation.js";
const router = Router();

router.post(
  "/",
  fileUpload(fileValidation.image).fields([
    { name: "image", maxCount: 1 },
    { name: "coverImages", maxCount:5 },
  ]),
  validation(addProductVal), 
  productController.addNewProduct
);

export default router;
