import joi from "joi";
import { generalFields } from "../../middleware/validation.js";
import { deleteValidationHandler } from "../../utils/globalErrorValidation.js";
export const addProductVal = {
  body: joi.object().required().keys({
      name: generalFields.name.required(),
      description: joi.string().required(),
      quantity: joi.number().integer().positive().required(),
      price: joi.number().positive().precision(2).required(),
      discount: joi.number().min(0).max(100),
      colors: joi.string().custom((value, helpers) => {
        try {
          const colorsArray = JSON.parse(value);
          if (!Array.isArray(colorsArray)) {
            throw new Error('Invalid array format');
          }
          const allStrings = colorsArray.every(item => typeof item === 'string'&& !Number(item));
          if (!allStrings) {
            throw new Error('Array must contain only strings');
          }
          return value; // Return the original JSON string if validation passes
        } catch (error) {
          throw new Error('Invalid array format');
        }
      }) ,
      size:joi.string().custom((value, helpers) => {
        try {
          const colorsArray = JSON.parse(value);
          if (!Array.isArray(colorsArray)) {
            throw new Error('Invalid array format');
          }
          const allStrings = colorsArray.every(item => typeof item === 'string');
          if (!allStrings) {
            throw new Error('Array must contain only strings');
          }
          return value; // Return the original JSON string if validation passes
        } catch (error) {
          throw new Error('Invalid array format');
        }
      }),
      categoryId: generalFields.id,
      subCategoryId: generalFields.id,
      brandId:generalFields.id
    }),
  // file: generalFields.file,
  files: joi.object().required().keys({
    coverImages: joi.array().items(generalFields.file).max(5),
    image: joi.array()
      .items(
        generalFields.file
        // joi.object({
        //   fieldname: joi.string().valid('image').required(),
        //   originalname: joi.string().required(),
        //   encoding: joi.string().required(),
        //   mimetype: joi.string().valid('image/jpeg', 'image/png').required(),
        //   destination: joi.string().required(),
        //   filename: joi.string().required(),
        //   path: joi.string().required(),
        //   size: joi.number().required(),
        // }).unknown(true) // Allow additional properties in the object
      ) .max(1).required(),
  
  }),
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};
export const updateProductVal = {
  body: joi.object().required().keys({
      name: generalFields.name,
      description: joi.string(),
      quantity: joi.number().integer().positive(),
      price: joi.number().positive().precision(2),
      discount: joi.number().min(0).max(100),
      colors: joi.string().custom((value, helpers) => {
        try {
          const colorsArray = JSON.parse(value);
          if (!Array.isArray(colorsArray)) {
            throw new Error('Invalid array format');
          }
          const allStrings = colorsArray.every(item => typeof item === 'string'&& !Number(item));
          if (!allStrings) {
            throw new Error('Array must contain only strings');
          }
          return value; // Return the original JSON string if validation passes
        } catch (error) {
          throw new Error('Invalid array format');
        }
      }) ,
      size:joi.string().custom((value, helpers) => {
        try {
          const colorsArray = JSON.parse(value);
          if (!Array.isArray(colorsArray)) {
            throw new Error('Invalid array format');
          }
          const allStrings = colorsArray.every(item => typeof item === 'string');
          if (!allStrings) {
            throw new Error('Array must contain only strings');
          }
          return value; // Return the original JSON string if validation passes
        } catch (error) {
          throw new Error('Invalid array format');
        }
      }),
    }),
  files: joi.object().required().keys({
    coverImages: joi.array().items(generalFields.file).max(5),
    image: joi.array()
      .items(generalFields.file) .max(1)
    }),
  params: joi.object().required().keys({
    id:generalFields.id
  }),
  query: joi.object().required().keys({}),
};
export const deleteProductVal = deleteValidationHandler(generalFields)