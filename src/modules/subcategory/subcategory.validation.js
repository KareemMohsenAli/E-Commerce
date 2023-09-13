import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'
import { apiFeaturesValidation, deleteValidationHandler } from '../../utils/globalErrorValidation.js'
export const addSubCategoryVal = {
    body: joi.object().required().keys({
            name: generalFields.name.required(),
        categoryID:generalFields.id
    }),
    file: generalFields.file.required().messages({
        'any.required': 'Please upload a file',
      }),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}
export const updateSubCategoryVal = {
    body: joi.object().required().keys({
        name: generalFields.name,
    }),
    file: generalFields.file,
    params: joi.object().required().keys({
        subCategoryId:generalFields.id
    }),
    query: joi.object().required().keys({})
}
export const deleteSubCategoryVal = deleteValidationHandler(generalFields)
export const apiFeaturesCategoryVal = apiFeaturesValidation()
