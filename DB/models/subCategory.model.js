import { Schema, model, Types } from "mongoose";

const subCategorySchema = new Schema(
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
      required: [true, "name is required"],
      unique: [true, "name is unique"],
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
    image: Object,
    customid: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

subCategorySchema.virtual("brand", {
  ref: "brand",
  localField: "_id",
  foreignField: "subCategoryId",
});

const subCategoryModel = model("subCategory", subCategorySchema);
export default subCategoryModel;
