import { StatusCodes } from "http-status-codes";
import CouponModel from "../../../../DB/model/Coupon.js";
import OrderModel from "../../../../DB/model/Order.js";
import productModel from "../../../../DB/model/Product.js";
import { AppError } from "../../../utils/AppError.js";
import CartModel from "../../../../DB/model/cart.js";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.stripKey); 
export const order = async (req, res, next) => {
  let { products, address, phone, note, coupon, paymentMethod } = req.body;
  const cart = await CartModel.findOne({ userId: req.user._id });
  if (!req.body.products) {
    products = cart.products;
    if (!products.length) {
      return next(new AppError("there's no products in cart", 404));
    }
  }
  if (coupon) {
    const findCoupon = await CouponModel.findOne({ code: coupon });
    !findCoupon && next(new AppError("coupon not found", 404));
    if (findCoupon.expiredDate < Date.now() ||findCoupon.numOfUses <= findCoupon.usedBy.length) {
      return next(new AppError("coupon is expired", 409));
    }
    if (findCoupon.usedBy.includes(req.user._id)) {
      return next(new AppError("user is already use his coupon", 409));
    }
    req.body.coupon = findCoupon;
  }
  const newProducts = [];
  const productIds = [];
  let price = 0;
  for (const product of products) {
    const findProduct = await productModel.findById(product.product);
    console.log("findProduct:", findProduct);
    console.log(product, "asdasdsa  ");
    if (!findProduct) {
      return next(new AppError("product is not found" + product.product, 404));
    }
    if (findProduct.stock <= product.quantity) {
      return next(new AppError("out of stock", 404));
    }
    newProducts.push({
      product: {
        name: findProduct.name,
        price: findProduct.price,
        paymentPrice: findProduct.paymentPrice,
        productId: findProduct._id,
      },
      quantity: product.quantity,
    });

    productIds.push(findProduct._id);
    price += findProduct.price * product.quantity;
  }
  for (const product of newProducts) {
    const existProduct = await productModel.findOne({
      _id: product.product.productId,
    });
    existProduct.stock = existProduct.stock - product.quantity;
    existProduct.save();
    // await productModel.updateOne({ _id:product.product.productId }, { $inc: { stock: -product.quantity } });
  }
  const createOrder = await OrderModel.create({
    userId: req.user._id,
    address,
    phone,
    couponId: req.body.coupon?._id,
    paymentMethod,
    status: paymentMethod === "card" ? "waitPayment" : "placed",
    products: newProducts,
    price,
    paymentPrice: price - price * ((req.body.coupon?.amount || 0) / 100),
    note,
  });
  
  
  if(paymentMethod==="card"){
    if(req.body.coupon){
      const coupon= await stripe.coupons.create({percent_off:req.body.coupon.amount,duration:"once"})
      req.body.stripeCoupon=coupon.id
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      discounts:req.body.stripeCoupon?[{coupon:req.body.stripeCoupon}]:[],
      line_items: newProducts.map((product) => {
       return {
        price_data: {
          currency: 'EGP', // Adjust the currency as needed
          product_data: { 
            name: product.product.name,
          },
          unit_amount: product.product.paymentPrice * 100, // Amount in cents
        },
        quantity: product.quantity,
       }
      }),
      mode: 'payment',
      metadata:{
        orderId:createOrder._id.toString(),
      },
      customer_email:req.user.email,
      success_url: process.env.successUrl, // Replace with your success URL
      cancel_url: process.env.cancelUrl, // Replace with your cancel URL
    });

    // Update your createOrder object with the session ID
    // createOrder.sessionId = session.id;
    if (req.body.coupon) {
      await CouponModel.updateOne(
        { code: req.body.coupon.code },
        {
          $addToSet: {
            usedBy: req.user._id,
          },
        }
      );
    }
    res.status(StatusCodes.CREATED).json({ message: "Done", session });
  }


  if (req.body.products) {
    console.log({ productIds });
    await CartModel.updateOne(
      { useId: req.user._id },
      {
        $pull: {
          products: {
            product: {
              $in: productIds,
            },
          },
        },
      }
    );
  } else {
    await CartModel.updateOne({ useId: req.user._id }, { products: [] });
  }


  if (req.body.coupon) {
    await CouponModel.updateOne(
      { code: req.body.coupon.code },
      {
        $addToSet: {
          usedBy: req.user._id,
        },
      }
    );
  }
  res.status(StatusCodes.CREATED).json({ message: "Done", createOrder });
};
export const webHook=async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {  
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.endPointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const order=await OrderModel.findByIdAndUpdate(event.data.object.metadata.orderId,{
        status:'placed'
      },{new:true})
      res.json({order})
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
}
