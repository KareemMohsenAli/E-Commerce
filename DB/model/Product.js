import { model, Schema, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String,  required: true , required:true,unique:true},
    slug: { type: String,  required: true },//mota7 kam wa7da
    description: { type: String, required:true ,unique:true},
    stock: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    paymentPrice: { type: Number, required: true, default: 0 },
    colors: { type: Array },
    size: { type: Array },
    coverImages: { type:Array },
    image: { type: Object,required:true},
    categoryId: { type:Types.ObjectId, ref: "Category", required: true },
    subCategoryId: { type:Types.ObjectId, ref: "SubCategory", required: true },
    brandId:{ type:Types.ObjectId, ref: "Brand", required: true },
    avgRate: { type: Number,default: 0 },
    rateNo: { type: Number,default: 0},
    sold: { type: Number, default: 0 },//5ad kam wa7da
    createdBy: { type: Types.ObjectId, ref: 'User', required: false },
    wishList:[{ type: Types.ObjectId, ref: 'User', required: true }]

  },
  {
    timestamps: true,
  }
);

const productModel = model("Product", productSchema);

export default productModel;
