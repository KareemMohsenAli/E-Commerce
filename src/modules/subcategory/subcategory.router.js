import { Router } from "express";
import * as scc from "./controller/subCategory.js";
import {
  addSubCategoryVal,
  apiFeaturesCategoryVal,
  deleteSubCategoryVal,
  updateSubCategoryVal,
} from "./subcategory.validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth, authorization } from "../../middleware/auth.js";

const router = Router({ mergeParams: true });

router.post(
  "/addsubcategory",
  auth,authorization(["Admin"]),
  fileUpload(fileValidation.image).single("image"),
  validation(addSubCategoryVal),
  asyncHandler(scc.addSubCategory)
);
router.put(
  "/updatesubcategory/:subCategoryId",
  auth,authorization(["Admin"]),
  fileUpload(fileValidation.image).single("image"),
  validation(updateSubCategoryVal),
  asyncHandler(scc.updateSubCategory)
);
router.delete(
  "/deletesubCategory/:id",
  auth,authorization(["Admin"]),
  validation(deleteSubCategoryVal),
  asyncHandler(scc.deleteSubCategory)
);
router.get("/getallsubcategories",validation(apiFeaturesCategoryVal), asyncHandler(scc.getAllSubCatgory));

//get all catgeories 
router.get("/", asyncHandler(scc.getAllSubCategories));

export default router;
