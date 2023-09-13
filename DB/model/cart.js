import { model, Schema, Types } from 'mongoose';
const CartSchema = new Schema({

    userId: { type: Types.ObjectId, ref: 'User', required: true },
    products:[{
        product:{type:Types.ObjectId,required:true,ref:'Product'},
        quantity:{type:String,required:true,default:1}
   } ]
}, {
    timestamps: true,
    },

)
const CartModel = model('Cart', CartSchema)
export default CartModel   