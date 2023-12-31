import { Router } from "express";
import * as productController from "./controller/product.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import { addProductVal, deleteProductVal, updateProductVal } from "./product.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth, authorization } from "../../middleware/auth.js";
const router = Router();

router.post(
  "/",
  auth,authorization(["Admin"]),
  fileUpload(fileValidation.image).fields([
    { name: "image", maxCount: 1 },
    { name: "coverImages", maxCount:5 },
  ]),
  validation(addProductVal), 
  asyncHandler( productController.addNewProduct)
)

router.put(
  "/:id",
  auth,authorization(["Admin"]),
  fileUpload(fileValidation.image).fields([
    { name: "image", maxCount: 1 },
    { name: "coverImages", maxCount:5 },
  ]),
  validation(updateProductVal), 
  asyncHandler( productController.updateProduct)
)


router.delete(
  "/:id",
  auth,authorization(["Admin"]),
  validation(deleteProductVal), 
  asyncHandler( productController.deleteProduct)
)

router.get('/',asyncHandler(productController.getallProduct))
 
;

export default router;
