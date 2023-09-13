import { StatusCodes } from "http-status-codes";
import productModel from "../../../../DB/model/Product.js";
import { AppError } from "../../../utils/AppError.js";
import CartModel from "../../../../DB/model/cart.js";

export const addCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new AppError("product doesnt exist", StatusCodes.CONFLICT));
  }
  if (product.stock < quantity) {
    await product.updateOne(
      { _id: productId },
      {
        $addToSet: {
          wishList: req.user._id,
        },
      }
    );
    return next(new AppError("out of stock", StatusCodes.CONFLICT));
  }
  const cart = await CartModel.findOne({ userId: req.user.id });
  const prooductIndex = cart.products.findIndex((product) => {
    return product.product == productId;
  });
  if (prooductIndex == -1) {
    cart.products.push({ product: productId, quantity });
  } else {
    cart.products[prooductIndex].quantity = quantity;
  }
  console.log({cart});
   await cart.save();
  return res.json({ message: "Done",});
  //   const cart = await CartModel.findById({ userId: req.user._id });
  //   let exist = false;
  //   for (let i = 0; i < cart.products.length; i++) {
  //     if (cart.products[i].product.toString() === productId) {
  //       cart.products[i].quantity = quantity;
  //       exist = true;
  //       break;
  //     }
  //     if (!exist) {
  //       cart.products[i].product.push({ product: productId, quantity });
  //     }

  //     await cart.save();
  //   }
};
export const deleteCart = async (req, res, next) => {
  const { id } = req.params;
  const product = await CartModel.findOne({
    userId: req.user._id,
    "products.product": id,
  });
  if (!product) {
    return next(new AppError("product doesnt exist", StatusCodes.CONFLICT));
  }
  const removeFromCard = await CartModel.updateOne(
    {
      userId: req.user._id,
    },
    {
      $pull: {
        products: {
          product: id,
        },
      },
    }
  );
res.json({message:"done",removeFromCard})
  // console.log(removeFromCard);
};
export const getUserCart=async(req,res,next)=>{ 
  const cart = await CartModel.findOne({userId:req.user._id}).populate([{path:'products.product',populate:[{path:'categoryId'}]}])
  let totalPrice=0
  cart.products=cart.products.filter((ele)=>{
    if(ele?.product){
      totalPrice+=(ele.product.paymentPrice*ele.product.price)
      return ele
    }

  })
    res.json({cart,totalPrice})
}
