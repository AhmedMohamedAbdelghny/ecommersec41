import { Router } from "express";
import * as OV from "./order.validation.js";
import * as OC from "./order.controller.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { validRoles } from "../../utils/systemRoles.js";
import express from 'express';

const router = Router();

router.post(
  "/create",
  auth([...validRoles.User, ...validRoles.Admin]),
  validation(OV.createOrder),
  OC.createOrder
);

router.patch("/:orderId",
  validation(OV.cancelOrder),
  auth([...validRoles.User, ...validRoles.Admin]),
  OC.cancelOrder)

 



router.post('/webhook', express.raw({type: 'application/json'}), OC.webhook);







export default router;
