import { Router } from "express";
import * as copounContoller from "./controller/coupon.js"
import { auth, authorization } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { copounVal, deleteCopounVal } from "./coupon.validation.js";

const router = Router()
// router.get('/', (req ,res)=>{
//     res.status(200).json({message:"order Module"})
// })
router.route("/").post(auth,authorization(["Admin"]),validation(copounVal),copounContoller.addCoupon)
router.route("/:couponId").delete(auth,authorization(["Admin"]),validation(deleteCopounVal),copounContoller.deleteCopoun)





export default router