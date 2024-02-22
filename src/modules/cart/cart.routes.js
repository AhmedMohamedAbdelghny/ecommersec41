import { Router } from "express";
import * as CV from "./cart.validation.js";
import * as CC from "./cart.controller.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { validRoles } from "../../utils/systemRoles.js";
import { headers } from "../../utils/generalField.js";

const router = Router();

router.post(
  "/create",
  auth(validRoles.Admin),
  validation(CV.createCart),
  CC.createCart
);

router.put(
  "/remove",
  auth(validRoles.Admin),
  // validation(CV.removeCart),
  CC.removeCart
);
router.put(
  "/clear",
  auth(validRoles.Admin),
  validation(CV.clearCart),
  CC.clearCart
);



export default router;
