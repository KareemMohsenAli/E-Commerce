import { Router } from "express";
import * as cc from "./controller/category.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import { addCategoryVal, deleteCategoryVal, updateCategoryVal } from "./category.validation.js";
import subCategories from "../subcategory/subcategory.router.js"
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()

router.use('/:categoryID/subCategory/',subCategories)

router.post('/addcategory',fileUpload(fileValidation.image).single('image'),validation(addCategoryVal),asyncHandler(cc.addCategory) )
router.put('/updatecategory/:id',fileUpload(fileValidation.image).single('image'),validation(updateCategoryVal),asyncHandler(cc.updateCategory) )
router.delete('/deletecategory/:id',validation(deleteCategoryVal),asyncHandler(cc.deleteCategory) )
router.get('/getallcategories',asyncHandler(cc.getAllCategories) )
router.get('/getAllCategoriesSubCategories/:id',validation(deleteCategoryVal),asyncHandler(cc.getAllCategoriesSubCategories) )





export default router