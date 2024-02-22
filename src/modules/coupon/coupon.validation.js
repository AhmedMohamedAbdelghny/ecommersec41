import joi from "joi";
import { generalFiled, headers } from "../../utils/generalField.js";

export const createCoupon = {
  body: joi
    .object()
    .keys({
      code: joi.string().min(2).max(30).required(),
      amount: joi.number().min(1).max(100).required(),
      fromDate: joi.date().greater(Date.now()-(24*60*60*1000)).required(),
      toDate: joi.date().greater(joi.ref("fromDate")).required(),
    })
    .required(),
  headers: headers.headers.required(),
};
export const updateCoupon = {
  body: joi
    .object()
    .keys({
      code: joi.string().min(2).max(30),
      amount: joi.number().min(1).max(100),
      fromDate: joi.date().greater(Date.now()-(24*60*60*1000)),
      toDate: joi.date().greater(joi.ref("fromDate")),
    })
    .required(),
  headers: headers.headers.required(),
};
