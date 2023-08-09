import { model, Schema, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String,  },
    slug: { type: String,  },//mota7 kam wa7da
    description: { type: String, required: true},
    stock: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    paymentPrice: { type: Number, required: true, default: 0 },
    colors: { type: Array },
    size: { type: Array },
    coverImages: { type:Array },
    image: { type: Object},
    categoryId: { type:Types.ObjectId, ref: "Category", required: true },
    subCategoryId: { type:Types.ObjectId, ref: "SubCategory", required: true },
    brandId:{ type:Types.ObjectId, ref: "Brand", required: true },
    avgRate: { type: Number,default: 0 },
    rateNo: { type: Number,default: 0},
    sold: { type: Number, default: 0 },//5ad kam wa7da
  },
  {
    timestamps: true,
  }
);

const productModel = model("Product", productSchema);

export default productModel;