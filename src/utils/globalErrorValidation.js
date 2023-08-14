import joi from "joi";

export function deleteValidationHandler(generalFields) {
    return {
      body: joi.object().required().keys({}),
      params: joi.object().required().keys({
        id: generalFields.id,
      }),
      query: joi.object().required().keys({}),
    };
  }
  