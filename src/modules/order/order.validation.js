import joi from "joi";
import { generalFields } from "../../middleware/validation.js";
export const addOrder = {
    userId: generalFields.id,
    products: joi.array().items(
        joi.object({
          product: joi.object({
            name: joi.string().required(),
            price: joi.number().required(),
            paymentPrice: joi.number().required(),
            productId: joi.string().required(), // Assuming productId is a string, adjust this to match your data type
          }).required(),
          quantity: joi.number().required().default(1),
        })
      ),
    body: joi.object().required().keys({
    address: joi.string().required(),
    phone: joi.string().regex(/^\d{10}$/).required(), // Assumes a 10-digit phone number
    note: joi.string().allow(''),
    coupon: joi.string().allow(''),
    paymentMethod: joi.string().valid('cash', 'card').default('cash'),
    status: joi.string().valid('waitPayment', 'canceled', 'Rood', 'delivered', 'rejected', 'placed').default('placed'),



    }),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
  };