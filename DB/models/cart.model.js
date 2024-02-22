import { Schema, model, Types } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: [true, "userId is required"],
      ref: "user",
    },
    products: [
      {
        productId: { type: Types.ObjectId, ref: "product", required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const cartModel = model("cart", cartSchema);
export default cartModel;
