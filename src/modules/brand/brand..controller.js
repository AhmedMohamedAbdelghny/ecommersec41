import { nanoid } from "nanoid";
import categoryModel from "../../../DB/models/category.model.js";
import { AppError, asyncHandler } from "../../utils/asyncHandler.js";
import slugify from "slugify";
import cloudinary from "../../utils/cloudinary.js";
import brandModel from "../../../DB/models/brand.model.js";
import subCategoryModel from "../../../DB/models/subCategory.model.js";

// ************************************createbrand*************************************
export const createbrand = asyncHandler(async (req, res, next) => {
  const { name, categoryId, subCategoryId } = req.body;

  const categoryExist = await categoryModel.findOne({
    _id: categoryId,
  });
  if (!categoryExist) {
    return next(new AppError("category not exist", 404));
  }

  const subCategoryExist = await subCategoryModel.findOne({
    _id: subCategoryId,
  });
  if (!subCategoryExist) {
    return next(new AppError("subCategory not exist", 404));
  }

  const brandExist = await brandModel.findOne({
    name: name.toLowerCase(),
  });

  if (brandExist) {
    return next(new AppError("brand already exist", 400));
  }
  const slug = slugify(name, {
    replacement: "_",
    lower: true,
  });
  if (!req.file) {
    return next(new AppError("image is required", 400));
  }
  const customid = nanoid(4);

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Ecommercec41/categories/${categoryExist.customid}/subCategories/${subCategoryExist.customid}/Brands/${customid}`,
    }
  );
  const brand = await brandModel.create({
    name,
    slug,
    image: { secure_url, public_id },
    customid,
    categoryId,
    subCategoryId,
    createdBy: req.user._id,
  });

  if (!brand) {
    await cloudinary.uploader.destroy(public_id);
    return next(new AppError("fail", 500));
  }
  res.status(201).json({ msg: "done", brand });
});

// ************************************updatebrand*************************************
export const updatebrand = asyncHandler(async (req, res, next) => {
  const { name, categoryId, subCategoryId } = req.body;
  const { id } = req.params;

  const category = await categoryModel.findOne({ _id: categoryId });
  if (!category) {
    return next(new AppError("category not exist !", 404));
  }
  const subCategory = await subCategoryModel.findOne({ _id: subCategoryId });
  if (!subCategory) {
    return next(new AppError("category not exist !", 404));
  }

  const brand = await brandModel.findOne({
    _id: id,
    createdBy: req.user._id,
  });

  if (!brand) {
    return next(new AppError("brand not exist or you are not owner!", 404));
  }

  if (name) {
    if (name.toLowerCase() == brand.name) {
      return next(
        new AppError("brand name match old name plz change it!", 400)
      );
    }

    if (await brandModel.findOne({ name: name.toLowerCase() })) {
      return next(new AppError("brand name already exist!", 400));
    }
    brand.name = name.toLowerCase();
    brand.slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(brand.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `Ecommercec41/categories/${category.customid}/subCategories/${subCategory.customid}/Brands/${brand.customid}`,
      }
    );
    brand.image = { secure_url, public_id };
  }
  await brand.save();
  res.status(200).json({ msg: "done", brand });
});
