import { AppError, asyncHandler } from "../../utils/asyncHandler.js";
import orderModel from "../../../DB/models/order.model.js";
import productModel from "../../../DB/models/product.model.js";
import couponModel from "../../../DB/models/coupon.model.js";
import cartModel from "../../../DB/models/cart.model.js";

import { createInvoice } from "../../utils/pdf.js";
import { emailFunc } from "../../services/sendEmail.js";
// ************************************createOrder*************************************
export const createOrder = asyncHandler(async (req, res, next) => {
  const { paymentMethod, phone, address } = req.body;

  //================== check coupon===========================
  if (req.body?.couponCode) {
    const coupon = await couponModel.findOne({
      code: req.body.couponCode.toLowerCase(),
      usedBy: { $nin: [req.user._id] },
    });
    if (!coupon || coupon.toDate < Date.now()) {
      return next(new AppError("coupon not exist or expired"));
    }

    req.body.coupon = coupon;
  }

  //================ check if send productId ===================
  let newProducts = [];
  let flag = false;

  if (!req.body.productId) {
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart.products.length) {
      return next(new AppError("please select products to make order"));
    }
    newProducts = cart.products;
    flag = true;
  } else {
    newProducts = [
      { productId: req.body?.productId, quantity: req.body?.quantity },
    ];
  }

  //================ collect data to create order ===================
  let finalProducts = [];
  let ids = [];
  let subPrice = 0;
  for (let product of newProducts) {
    const checkProduct = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
    });
    if (!checkProduct) {
      return next(new AppError("product not exist or quantity not enough"));
    }
    if (flag) {
      product = product.toObject();
    }
    product.title = checkProduct.title;
    product.price = checkProduct.priceAfterDiscount;
    product.finalPrice = checkProduct.priceAfterDiscount * product.quantity;
    finalProducts.push(product);
    ids.push(product.productId);
    subPrice += product.finalPrice;
  }

  //================ create order ===================

  const order = await orderModel.create({
    userId: req.user._id,
    products: finalProducts,
    subPrice,
    couponId: req.body?.coupon?._id,
    totalprice: subPrice - subPrice * ((req.body?.coupon?.amount || 0) / 100),
    address,
    phone,
    paymentMethod,
    status: paymentMethod == "cash" ? "placed" : "waitPayment",
  });

  //==================== decrease product ==============
  for (const product of finalProducts) {
    await productModel.findOneAndUpdate(
      { _id: product.productId },
      {
        $inc: { stock: -Number(product.quantity) },
      },
      { new: true }
    );
  }

  //======================== coupon usedBy ===========
  if (req.body?.couponCode) {
    await couponModel.findOneAndUpdate(
      { _id: req.body?.coupon?._id },
      {
        $addToSet: { usedBy: req.user._id },
      },
      { new: true }
    );
  }

  //===================== cart ============
  if (!flag) {
    await cartModel.findOneAndUpdate(
      { userId: req.user._id },
      { $pull: { products: { productId: req.body.productId } } },
      { new: true }
    );
  } else {
    await cartModel.findOneAndUpdate(
      { userId: req.user._id },
      { products: [] },
      { new: true }
    );
  }

  //===================== create pdf ===============

  const invoice = {
    shipping: {
      name: req.user.name,
      address: req.user.address,
      city: "cairo",
      state: "cairo",
      country: "Egypt",
      postal_code: 94111
    },
    items: order.products,
    subtotal: subPrice,
    paid: order.totalprice,
    invoice_nr: order._id,
    date: order.createdAt
  };
  await createInvoice(invoice, "invoice.pdf");

  //===================== send notification to user =================
  await emailFunc({
    email: req.user.email,
    subject: "pdf order",
    attachments: [
      {
        path: "invoice.pdf",
        contentType: "application/pdf"
      },
      {
        path:"route.jpg",
        contentType: "image.jpg"

      }
    ]
  })

  res.status(201).json({ msg: "done", order });
});


// ********************************** cancel order **********************************
export const cancelOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params
  const { reason } = req.body
  const order = await orderModel.findOne({ _id: orderId, userId: req.user._id })
  if (!order) {
    return next(new AppError(`invalid order with id ${orderId} `, 404))
  }
  if ((order?.status != 'placed' && order?.paymentMethod == 'cash') || (order?.status != 'waitPayment' && order?.paymentMethod == 'visa')) {
    return next(new AppError(`can not cancel your order `, 400))
  }
  const cancelOrder = await orderModel.updateOne({ _id: order._id }, { status: "cancel", canceledBy: req.user._id, reason })
  if (!cancelOrder) {
    return next(new AppError(`fail when cancel order `, 500))
  }
  if (order.couponId) {
    await couponModel.updateOne({ _id: order.couponId }, { $pull: { usedBy: req.user._id } })
  }
  for (const product of order.products) {
    await productModel.updateOne({ _id: product.productId }, { $inc: { stock: product.quantity } })
  }
  res.status(201).json({ msg: "done", cancelOrder })

})