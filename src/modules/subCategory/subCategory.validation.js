import joi from "joi";
import { generalFiled } from "../../utils/generalField.js";

export const createSubCategory = {
  body: joi
    .object()
    .keys({
      name: joi.string().min(2).max(15).required(),
    })
    .required(),
  file: generalFiled.file.required(),
  params: joi
    .object()
    .keys({
      categoryId: generalFiled.id.required(),
    })
    .required(),
};

export const updateSubCategory = {
  body: joi
    .object()
    .keys({
      name: joi.string().min(2).max(15),
      categoryId: generalFiled.id,
    })
    .required(),
  file: generalFiled.file,
  params: joi
    .object()
    .keys({
      categoryId: generalFiled.id.required(),
      id: generalFiled.id.required(),
    })
    .required(),
};
