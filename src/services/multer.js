import multer from "multer";
import { AppError } from "../utils/asyncHandler.js";
import { allowExtension } from "../utils/allowExtension.js";

export const multerCloudinary = (customValidation) => {
  if (!customValidation) {
    customValidation = allowExtension.image;
  }

  const storage = multer.diskStorage({});
  const fileFilter = function (req, file, cb) {

    if (customValidation.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new AppError("invalid type"), false);
  };

  const upload = multer({ fileFilter, storage });
  return upload;
};
