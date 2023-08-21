import { Router } from "express";
import * as authController from "./controller/registration.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
const router = Router()

router.post("/signup",fileUpload(fileValidation.image).single('image'),authController.signUp)
router.patch("/comfirmemail",authController.confirmEmail)
router.post("/signin",authController.signIn)

router.patch("/sendemailpin",authController.sendEmailPinforgetPassword)
router.patch("/forgetpassword",authController.forgetPassword)


export default router