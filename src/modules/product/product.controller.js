import { nanoid } from "nanoid";
import categoryModel from "../../../DB/models/category.model.js";
import { AppError, asyncHandler } from "../../utils/asyncHandler.js";
import slugify from "slugify";
import cloudinary from "../../utils/cloudinary.js";
import brandModel from "../../../DB/models/brand.model.js";
import subCategoryModel from "../../../DB/models/subCategory.model.js";
import productModel from "../../../DB/models/product.model.js";
import userModel from "../../../DB/models/user.model.js";
import ApiFeatures from "../../utils/apiFeatures.js";

// ************************************createProduct*************************************
export const createProduct = asyncHandler(async (req, res, next) => {
  const { title, price, discount, stock, brandId, categoryId, subCategoryId } =
    req.body;

  const categoryExist = await categoryModel.findById(categoryId);
  if (!categoryExist) {
    return next(new AppError("category not exist", 404));
  }

  const subCategoryExist = await subCategoryModel.findById(subCategoryId);
  if (!subCategoryExist) {
    return next(new AppError("subCategory not exist", 404));
  }

  const brandExist = await brandModel.findById(brandId);
  if (!brandExist) {
    return next(new AppError("brand already exist", 400));
  }

  if (!req.files) {
    return next(new AppError("images is required", 400));
  }
  let customId = nanoid(4);
  let arr = [];
  let arrIds = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `Ecommercec41/products/${customId}`,
      }
    );
    arr.push({ secure_url, public_id });
    arrIds.push(public_id);
  }

  // 2000 ==>50
  //2000-2000*(50/100)

  // if (discount) {
  let priceAfterDiscount = price - price * ((discount || 0) / 100);
  // }
  const slug = slugify(title, {
    replacement: "_",
    lower: true,
  });

  const product = await productModel.create({
    title,
    slug,
    price,
    discount,
    stock,
    brandId,
    categoryId,
    subCategoryId,
    priceAfterDiscount,
    images: arr, customid,
    createdBy: req.user._id,
  });
  if (!product) {
    await cloudinary.api.delete_resources(arrIds);
    return next(new AppError("fail  to create product", 500));
  }

  res.status(201).json({ msg: "done" });
});



//****************************** update product ******************************
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { stock, price, discount, brandId, subCategoryId, categoryId } =
    req.body;
  //>>>>check product
  const product = await productModel.findById({ _id: productId });
  if (!product) {
    return next(new AppError("product not found", 404));
  }
  //>>>>check subCategoryId & categoryId
  if (subCategoryId && categoryId) {
    const subCategory = await subCategoryModel.findOne({
      _id: subCategoryId,
      categoryId,
    });
    if (!subCategory) {
      return next(new AppError("invalid id on subCategory or category", 404));
    }
  }
  //>>>>check brandId
  if (brandId) {
    const Brand = await brandModel.findOne({ _id: brandId });
    if (!Brand) {
      return next(new AppError("invalid id on Brand", 404));
    }
  }
  //>>>>check title
  if (req.body.title) {
    if (product.title == req.body.title) {
      return next(new AppError("match old title plz change title", 400));
    }
    if (await productModel.findOne({ title: req.body.title })) {
      return next(new AppError("duplicated title", 400));
    }
    product.title = req.body.title;
    product.slug = slugify(req.body.title);
  }
  //>>>>check price & discount
  if (price && discount) {
    req.body.priceAfterDiscount = price - price * (discount / 100);
  } else if (price) {
    req.body.priceAfterDiscount = price - price * (product.discount / 100);
  } else if (discount) {
    req.body.priceAfterDiscount = product.price - product.price * (discount / 100);
  }
  //>>>>check stock<<<<<<\\
  if (stock) {
    req.body.stock = stock
  }

  //>>>>check images<<<<<<\\
  let newIds = []
  if (req.files) {
    let arrIds = []
    for (const product of product.images) {
      arrIds.push(product.public_id)
    }
    await cloudinary.api.delete_resources(arrIds);
    req.body.images = [];
    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `Ecommercec41/products/${product.customid}`,

        }
      );
      req.body.images.push({ secure_url, public_id });
      newIds.push(public_id)
    }
  }

  const updatedProduct = await productModel.findByIdAndUpdate(
    { _id: productId },
    req.body,
    { new: false }
  );

  if (!updatedProduct) {
    await cloudinary.api.delete_resources(newIds);
    return next(new AppError("fail", 500));
  }
  res.status(200).json({ msg: "success", updatedProduct });

});


//******************************  addToWishList ******************************
export const addToWishList = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  //>>>>check product
  const product = await productModel.findById({ _id: productId });
  if (!product) {
    return next(new AppError("product not found", 404));
  }
  const user = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    {
      $addToSet: { wishList: product._id }
    },
    { new: true })

  res.status(200).json({ msg: "done", user });

});
//******************************  removeFromWishList ******************************
export const removeFromWishList = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  //>>>>check product
  const product = await productModel.findById({ _id: productId });
  if (!product) {
    return next(new AppError("product not found", 404));
  }
  const user = await userModel.findOneAndUpdate(
    {
      _id: req.user._id,
      wishList: { $in: [productId] }
    },
    {
      $pull: { wishList: product._id }
    },
    { new: true })

  user ? res.status(200).json({ msg: "done", user }) : next(new AppError("product not on wishList", 404))

});


//****************************** getProducts ******************************


export const getProducts = asyncHandler(async (req, res, next) => {

  let apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .paginate()
    .select()
    .sort()
    .search()
    .filter()

  const products = await apiFeatures.mongooseQuery

  res.status(200).json({ msg: "done", page: apiFeatures.page, products })

});