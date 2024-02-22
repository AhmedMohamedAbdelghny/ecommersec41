import { Schema, model, Types } from "mongoose";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "code is required"],
      unique: [true, "code is unique"],
      lowercase: true,
      minLength: 2,
      maxLength: 30,
      trim: true,
    },
    createdBy: {
      type: Types.ObjectId,
      required: [true, "createdBy is required"],
      ref: "user",
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
      min: 1,
      max: 100,
      default: 1,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    usedBy: [
      {
        type: Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const couponModel = model("coupon", couponSchema);
export default couponModel;
