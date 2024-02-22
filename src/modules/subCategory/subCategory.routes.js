import { Router } from "express";
import * as CV from "./subCategory.validation.js";
import * as CC from "./subCategory..controller.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { validRoles } from "../../utils/systemRoles.js";
import { multerCloudinary } from "../../services/multer.js";
import { headers } from "../../utils/generalField.js";

const router = Router({ mergeParams: true });

router.post(
  "/create",
  validation(headers.headers),
  auth(validRoles.Admin),
  multerCloudinary().single("image"),
  validation(CV.createSubCategory),
  CC.createSubCategory
);

router.put(
  "/update/:id",
  validation(headers.headers),
  auth(validRoles.Admin),
  multerCloudinary().single("image"),
  validation(CV.updateSubCategory),
  CC.updateSubCategory
);

export default router;
