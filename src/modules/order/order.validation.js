import joi from "joi";
import { generalFiled, headers } from "../../utils/generalField.js";

export const createOrder = {
  body: joi
    .object()
    .keys({
      productId: generalFiled.id,
      quantity: joi.number().min(1),
      phone: joi.array().items(joi.string().required()).required(),
      address: joi.string().required(),
      couponCode: joi.string(),
      paymentMethod: joi.string().valid("cash", "card").required(),
    })
    .with("productId", "quantity")
    .required(),
  headers: headers.headers.required(),
};

export const cancelOrder = {
  params: joi
    .object()
    .keys({
      orderId: generalFiled.id.required(),
    }).required(),
  headers: headers.headers.required(),
};
