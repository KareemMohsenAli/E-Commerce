import { model, Schema, Types } from 'mongoose';


const categorySchema = new Schema({
    name: { type: String, required: true,unique:true },
    slug: { type: String, required: true,unique:true  },
    image: { type: Object },
    createdBy: { type: Types.ObjectId, ref: 'User', required: false },
}, {
    timestamps: true,    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        // Remove the "id" virtual field from the JSON output
        delete ret.id;
      },
    },

})
categorySchema.virtual('subcategories',{
    localField:'_id',
    foreignField:'categoryID',
    ref:'SubCategory'

})
const categoryModel = model('Category', categorySchema)

export default categoryModel