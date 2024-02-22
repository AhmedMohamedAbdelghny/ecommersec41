import { Schema, model, Types } from "mongoose";

const categorySchema = new Schema(
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
      ref: "user",
      required: [true, "createdBy is required"],
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

categorySchema.virtual("subCategory", {
  ref: "subCategory",
  localField: "_id",
  foreignField: "categoryId",
});

const categoryModel = model("category", categorySchema);
export default categoryModel;
