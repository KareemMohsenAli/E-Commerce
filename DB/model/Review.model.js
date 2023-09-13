import { model, Schema, Types } from 'mongoose';

const reviewSchema = new Schema({
    createdBy:{type:Types.ObjectId,ref:"User",require:true},
    productId:{type:Types.ObjectId,ref:"Product",require:true},
    rating:{type:Number, min:0, max:5, require:true},
    comment:{type:String}
}, {
    timestamps: true
})
const reviewModel = model('Review', reviewSchema)

export default reviewModel