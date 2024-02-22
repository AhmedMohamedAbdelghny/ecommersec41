import joi from "joi";
import { generalFiled } from "../../utils/generalField.js";

export const createbrand = {
  body: joi
    .object()
    .keys({
      name: joi.string().min(2).max(15).required(),
      categoryId: generalFiled.id.required(),
      subCategoryId: generalFiled.id.required(),
    })
    .required(),
  file: generalFiled.file.required(),
 
};

export const updatebrand = {
  body: joi
    .object()
    .keys({
      name: joi.string().min(2).max(15),
      categoryId: generalFiled.id.required(),
      subCategoryId: generalFiled.id.required(),
    })
    .required(),
  file: generalFiled.file,
  params: joi
  .object()
  .keys({
    id: generalFiled.id.required(),
  })
  .required(),
};
