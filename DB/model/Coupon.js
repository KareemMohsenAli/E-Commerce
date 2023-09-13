import { model, Schema, Types } from 'mongoose';
const CouponSchema = new Schema({
    code: { type: String, required: true,unique:true },
    amount: { type: Number,required:true },
    expiredDate: { type: Date, required: true,min:Date.now() },
    numOfUses:Number,
    usedBy: [{ type: Types.ObjectId, ref: 'User', required: true }],
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
    },

)
const CouponModel = model('Coupon', CouponSchema)

export default CouponModel