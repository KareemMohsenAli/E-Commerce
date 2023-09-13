import { Router } from "express";
import * as orderContoller from "./controller/order.js"
import { auth, authorization } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import express from 'express'
import { validation } from "../../middleware/validation.js";
import { addOrder } from "./order.validation.js";
const router = Router()
// router.get('/', (req ,res)=>{
//     res.status(200).json({message:"order Module"})
// })
router.route("/").post(auth,authorization(["User"]),validation(addOrder),orderContoller.order)
router.post('/webhook', express.raw({type: 'application/json'}),asyncHandler(orderContoller.webHook ));



export default router