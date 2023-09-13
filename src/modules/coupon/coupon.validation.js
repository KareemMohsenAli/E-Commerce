import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';
export const copounVal ={
  body: joi.object().required().keys({
    code: joi.string().required(), // Assuming code is a string and is required
    amount: joi.number().positive().required(),
    numOfUses: joi.number().positive(), // Assuming amount is a positive number and is required
    expiredDate: joi.date().greater('now').required(), // Assuming expiredDate is a valid date in ISO format and is in the future
  }),
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),

};
export const deleteCopounVal ={
  body: joi.object().required().keys({}),
  params: joi.object().required().keys({
    couponId:generalFields.id
  }),
  query: joi.object().required().keys({}),

};

