import joi from "joi";
import { generalFiled } from "../../utils/generalField.js";

export const createProduct = {
  body: joi
    .object()
    .keys({
      title: joi.string().min(2).max(100).required(),
      price: joi.number().min(1).required(),
      discount: joi.number().min(1).max(100).required(),
      stock: joi.number().min(1).required(),
      categoryId: generalFiled.id.required(),
      subCategoryId: generalFiled.id.required(),
      brandId: generalFiled.id.required(),
    })
    .required(),
  files: joi.array().items(generalFiled.file.required()).required(),
};

export const updateProduct = {
  body: joi
    .object()
    .keys({
      title: joi.string().min(2).max(100),
      price: joi.number().min(1),
      discount: joi.number().min(1).max(100),
      stock: joi.number().min(1),
      categoryId: generalFiled.id,
      subCategoryId: generalFiled.id,
      brandId: generalFiled.id,
    })
    .required(),
  files: joi.array().items(generalFiled.file),
  params: joi
    .object()
    .keys({
      productId: generalFiled.id.required(),
    })
    .required(),
};
