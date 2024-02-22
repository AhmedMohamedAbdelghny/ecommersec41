import { Schema, model, Types } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "name is required"],
      lowercase: true,
      minLength: 2,
      maxLength: 100,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "slug is required"],
      minLength: 2,
      maxLength: 100,
      trim: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
      required: [true, "createdBy is required"],
    },
    categoryId: {
      type: Types.ObjectId,
      required: [true, "email is required"],
      ref: "category",
    },
    subCategoryId: {
      type: Types.ObjectId,
      required: [true, "email is required"],
      ref: "subCategory",
    },
    brandId: {
      type: Types.ObjectId,
      required: [true, "brandId is required"],
      ref: "brand",
    },
    images: [Object],
    customid: String,
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    discount: {
      type: Number,
      default: 0,
    },
    priceAfterDiscount: {
      type: Number,
      required: [true, "priceAfterDiscount is required"],
    },
    stock: {
      type: Number,
      required: [true, "stock is required"],
    },
    avgRate: {
      type: Number,
      default: 0,
    },
    rateNum: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const productModel = model("product", productSchema);
export default productModel;
