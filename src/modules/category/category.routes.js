import { Router } from "express";
import * as CV from "./category.validation.js";
import * as CC from "./category.controller.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { validRoles } from "../../utils/systemRoles.js";
import { multerCloudinary } from "../../services/multer.js";
import { headers } from "../../utils/generalField.js";
import subCategoriesRoutes from "../subCategory/subCategory.routes.js";
const router = Router();

router.use("/:categoryId/subCategories", subCategoriesRoutes);

router.post(
  "/create",
  validation(headers.headers),
  auth(validRoles.Admin),
  multerCloudinary().single("image"),
  validation(CV.createCategory),
  CC.createCategory
);

router.put(
  "/update/:id",
  validation(headers.headers),
  auth(validRoles.Admin),
  multerCloudinary().single("image"),
  validation(CV.updateCategory),
  CC.updateCategory
);

router.delete(
  "/delete/:id",
  auth(validRoles.Admin),
  validation(CV.deleteCategory),
  CC.deleteCategory
);

router.get("/", CC.getCategories);

export default router;
