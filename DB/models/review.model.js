import { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    comment: {
      type: String,
      required: true
    },
    rate: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    userId: {
      type: Types.ObjectId,
      required: [true, "userId is required"],
      ref: "user",
    },
    productId: {
      type: Types.ObjectId,
      ref: "product",
      required: true,
    },
    orderId: {
      type: Types.ObjectId,
      ref: "order",
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

const reviewModel = model("review", reviewSchema);
export default reviewModel;
