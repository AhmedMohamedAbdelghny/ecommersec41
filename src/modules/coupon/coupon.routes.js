import { Router } from "express";
import * as CV from "./coupon.validation.js";
import * as CC from "./coupon.controller.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { validRoles } from "../../utils/systemRoles.js";

const router = Router();

router.post(
  "/create",
  auth(validRoles.Admin),
  validation(CV.createCoupon),
  CC.createCoupon
);

router.put(
  "/update/:id",
  auth(validRoles.Admin),
  validation(CV.updateCoupon),
  CC.updateCoupon
);

export default router;
