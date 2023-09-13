import { Router } from "express";
import * as cc from "./controller/category.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import { addCategoryVal, apiFeaturesCategoryVal, deleteCategoryVal, updateCategoryVal } from "./category.validation.js";
import subCategories from "../subcategory/subcategory.router.js"
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth, authorization } from "../../middleware/auth.js";
const router = Router()

router.use('/:categoryID/subCategory/',subCategories)

router.post('/addcategory',auth,authorization(["Admin"]),fileUpload(fileValidation.image).single('image'),validation(addCategoryVal),asyncHandler(cc.addCategory) )
router.put('/updatecategory/:id',auth,authorization(["Admin"]),fileUpload(fileValidation.image).single('image'),validation(updateCategoryVal),asyncHandler(cc.updateCategory) )
router.delete('/deletecategory/:id',auth,authorization(["Admin"]),validation(deleteCategoryVal),asyncHandler(cc.deleteCategory) )
router.get('/getallcategories',auth,authorization(["Admin"]),validation(apiFeaturesCategoryVal),asyncHandler(cc.getAllCategories) )
router.get('/getAllCategoriesSubCategories/:id',auth,authorization(["Admin"]),validation(deleteCategoryVal),asyncHandler(cc.getAllCategoriesSubCategories) )





export default router