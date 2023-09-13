// import joi from 'joi'
// import { generalFields } from '../../middleware/validation.js'

// export const addReviewVal = {
//     body: joi.object().required().keys({
//         productId: generalFields.id.required(),
//         rating:joi.number().min(0).max(5).required(),
//         comment:joi.string()
//     }),
//     params: joi.object().required().keys({}),
//     query: joi.object().required().keys({})
// }

// export const updateReviewVal = {
//     body: joi.object().required().keys({
//         rating:joi.number().min(0).max(5).required(),
//         comment:joi.string()
//     }),
//     params: joi.object().required().keys({
//         reviewId: generalFields.id.required(),
//     }),
//     query: joi.object().required().keys({})
// }

// export const deleteReviewVal = {
//     body: joi.object().required().keys({}),
//     params: joi.object().required().keys({
//         reviewId: generalFields.id
//     }),
//     query: joi.object().required().keys({})
// }