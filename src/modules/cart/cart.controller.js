import { AppError, asyncHandler } from "../../utils/asyncHandler.js";
import cartModel from "../../../DB/models/cart.model.js";
import productModel from "../../../DB/models/product.model.js";

// ************************************createCart*************************************
export const createCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await productModel.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });

  if (!product) {
    return next(new AppError("Product not found or quantity not enough"));
  }

  const cartExist = await cartModel.findOne({ userId: req.user._id });

  if (!cartExist) {
    const cart = await cartModel.create({
      userId: req.user._id,
      products: [{ productId, quantity }],
    });
    res.status(201).json({ msg: "done", cart });
  }

  let flag = false;

  for (const product of cartExist.products) {
    if (product.productId.toObject() == productId) {
      product.quantity = quantity;
      flag = true;
      break;
    }
  }
  if (!flag) {
    cartExist.products.push({ productId, quantity });
  }
  await cartExist.save();

  res.status(201).json({ msg: "done", cartExist });
});

// ************************************removeCart*************************************
export const removeCart = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  const cart = await cartModel.findOneAndUpdate(
    {
      "products.productId": id,
      userId: req.user._id,
    },
    { $pull: { products: { productId: id } } },
    { new: true }
  );

  cart
    ? res.status(200).json({ msg: "done", cart })
    : next(new AppError("cart not found", 404));
});

// ************************************clearCart*************************************
export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    {
      userId: req.user._id,
    },
    { products: [] },
    { new: true }
  );

  cart
    ? res.status(200).json({ msg: "done", cart })
    : next(new AppError("cart not found", 404));
});
