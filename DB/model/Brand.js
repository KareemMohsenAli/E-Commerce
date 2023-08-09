import { model, Schema, Types } from 'mongoose';
const BrandSchema = new Schema({
    name: { type: String, required: true,unique:true },
    slug: { type: String, required: true,unique:true  },
    image: { type: Object },
    createdBy: { type: Types.ObjectId, ref: 'User', required: false },
}, {
    timestamps: true,
    },

)
const BrandModel = model('Brand', BrandSchema)

export default BrandModel