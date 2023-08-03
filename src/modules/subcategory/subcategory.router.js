import { Router } from "express";
import * as scc from "./controller/subCategory.js"
import { addSubCategoryVal, deleteSubCategoryVal, searchByNameValSubCat, updateSubCategoryVal } from "./subcategory.validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()




router.get('/addsubcategory',fileUpload(fileValidation.image).single('image'),validation(addSubCategoryVal),asyncHandler(scc.addSubCategory) )
router.put('/updatesubcategory/:subCategoryId',fileUpload(fileValidation.image).single('image'),validation(updateSubCategoryVal),asyncHandler(scc.updateSubCategory) )
router.delete('/deletesubCategory/:subCategoryId',validation(deleteSubCategoryVal),asyncHandler(scc.deleteSubCategory) )
router.get('/searchbynamesubcat/',validation(searchByNameValSubCat),asyncHandler(scc.searchBynameSubCat) )



export default router