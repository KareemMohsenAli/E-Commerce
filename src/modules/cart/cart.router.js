import { Router } from "express";
import * as cartController from "./controller/cart.js"
import { auth, authorization } from "../../middleware/auth.js";
const router = Router()


router.route('/').post(auth,authorization(["User"]),cartController.addCart ).get(auth,authorization(["User"]),cartController.getUserCart )
router.route('/:id').delete(auth,authorization(["User"]),cartController.deleteCart)


export default router