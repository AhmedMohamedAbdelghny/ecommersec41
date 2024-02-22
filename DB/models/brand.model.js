import { Schema, model, Types } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: [true, "name is unique"],
      lowercase: true,
      minLength: 2,
      maxLength: 30,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "slug is required"],
      unique: [true, "slug is unique"],
      minLength: 2,
      maxLength: 30,
      trim: true,
    },
    createdBy: {
      type: Types.ObjectId,
      required: [true, "createdBy is required"],
      ref: "user",
    },
    categoryId: {
      type: Types.ObjectId,
      required: [true, "categoryId is required"],
      ref: "category",
    },
    subCategoryId: {
      type: Types.ObjectId,
      required: [true, "subCategoryId is required"],
      ref: "subCategory",
    },
    image: Object,
    customid: String,
  },
  {
    timestamps: true,
  }
);

const brandModel = model("brand", brandSchema);
export default brandModel;
