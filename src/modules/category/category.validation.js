import joi from "joi";
import { generalFiled, headers } from "../../utils/generalField.js";

export const createCategory = {
  body: joi
    .object()
    .keys({
      name: joi.string().min(2).max(15).required(),
      slug: joi.string().min(2).max(15),
    })
    .required(),
  file: generalFiled.file.required(),
};

export const updateCategory = {
  body: joi
    .object()
    .keys({
      name: joi.string().min(2).max(15),
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
export const deleteCategory = {
  params: joi
    .object()
    .keys({
      id: generalFiled.id.required(),
    })
    .required(),
  headers: headers.headers.required(),
};
