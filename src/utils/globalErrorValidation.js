import joi from "joi";
import { generalFields } from "../middleware/validation.js";
export function deleteValidationHandler(generalFields) {
    return {
      body: joi.object().required().keys({}),
      params: joi.object().required().keys({
        id: generalFields.id,
      }),
      query: joi.object().required().keys({}),
    };
  }
  

  export function apiFeaturesValidation() {
    return {
      body: joi.object().required().keys({}),
      params: joi.object().required().keys({

      }),
      query: joi.object().required().keys({
        page: joi.number().integer().min(1).default(1),
        sort: joi.string(),
        searchKey: joi.string(),
        fields: joi.string(),
        name: joi.string().regex(/^[^\d]*$/)
      }),
    };
  }
  