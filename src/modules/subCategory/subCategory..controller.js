import { nanoid } from "nanoid";
import categoryModel from "../../../DB/models/category.model.js";
import { AppError, asyncHandler } from "../../utils/asyncHandler.js";
import slugify from "slugify";
import cloudinary from "../../utils/cloudinary.js";
import subCategoryModel from "../../../DB/models/subCategory.model.js";

// ************************************createSubCategory*************************************
export const createSubCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { categoryId } = req.params;
  
  const categoryExist = await categoryModel.findOne({
    _id: categoryId,
  });
  if (!categoryExist) {
    return next(new AppError("category not exist", 404));
  }
  const subCategoryExist = await subCategoryModel.findOne({
    name: name.toLowerCase(),
  });

  if (subCategoryExist) {
    return next(new AppError("subCategory already exist", 400));
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
      folder: `Ecommercec41/categories/${categoryExist.customid}/subCategories/${customid}`,
    }
  );
  const subCategory = await subCategoryModel.create({
    name,
    slug,
    image: { secure_url, public_id },
    customid,
    categoryId,
    createdBy: req.user._id,
  });

  if (!subCategory) {
    await cloudinary.uploader.destroy(public_id);
    return next(new AppError("fail", 500));
  }
  res.status(201).json({ msg: "done", subCategory });
});

// ************************************updateSubCategory*************************************
export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id, categoryId } = req.params;

  const category = await categoryModel.findOne({ _id: categoryId });
  if (!category) {
    return next(new AppError("category not exist !", 404));
  }

  const subCategory = await subCategoryModel.findOne({
    _id: id,
    createdBy: req.user._id,
  });

  if (!subCategory) {
    return next(
      new AppError("subCategory not exist or you are not owner!", 404)
    );
  }

  if (name) {
    if (name.toLowerCase() == subCategory.name) {
      return next(
        new AppError("subCategory name match old name plz change it!", 400)
      );
    }

    if (await subCategoryModel.findOne({ name: name.toLowerCase() })) {
      return next(new AppError("subCategory name already exist!", 400));
    }
    subCategory.name = name.toLowerCase();
    subCategory.slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(subCategory.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `Ecommercec41/categories/${category.customid}/subCategories/${subCategory.customid}`,
      }
    );
    subCategory.image = { secure_url, public_id };
  }
  await subCategory.save();
  res.status(200).json({ msg: "done", subCategory });
});
