import { AppError, asyncHandler } from "../../utils/asyncHandler.js";
import couponModel from "../../../DB/models/coupon.model.js";

// ************************************createCoupon*************************************
export const createCoupon = asyncHandler(async (req, res, next) => {
  const { code, amount, fromDate, toDate } = req.body;

  const couponExist = await couponModel.findOne({ code: code.toLowerCase() });
  if (couponExist) {
    return next(new AppError("coupon already exists"));
  }

  const coupon = await couponModel.create({
    code,
    amount,
    fromDate,
    toDate,
    createdBy: req.user._id,
  });

  if (!coupon) {
    return next(new AppError("fail", 500));
  }
  res.status(201).json({ msg: "done", coupon });
});

// ************************************updateCoupon*************************************
export const updateCoupon = asyncHandler(async (req, res, next) => {
  const { code, amount, fromDate, toDate } = req.body;

  const coupon = await couponModel.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });
  if (!coupon) {
    return next(
      new AppError("coupon already exists or youare not allowed to update")
    );
  }

  if (code) {
    if (code.toLowerCase() == coupon.code) {
      return next(new AppError("coupon code match old code change it"));
    }
    if (await couponModel.findOne({ code: code.toLowerCase() })) {
      return next(new AppError("coupon already  exists"));
    }
    coupon.code = code.toLowerCase();
  }

  if (amount) {
    coupon.amount = amount;
  }
  if (fromDate) {
    coupon.fromDate = fromDate;
  }
  if (toDate) {
    coupon.toDate = toDate;
  }
  await coupon.save();

  res.status(201).json({ msg: "done", coupon });
});
