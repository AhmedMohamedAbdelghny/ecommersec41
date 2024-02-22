import path from "path";
import { config } from "dotenv";
config({ path: path.resolve("config/.env") });
const port = process.env.PORT || 3001;
import { dbConnection } from "../DB/dbConnection.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import subCategoryRoutes from "./modules/subCategory/subCategory.routes.js";
import brandRoutes from "./modules/brand/brand.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import couponRoutes from "./modules/coupon/coupon.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import orderRoutes from "./modules/order/order.routes.js";
import reviewRoutes from "./modules/review/review.routes.js";
import { globalErrorHandling } from "./utils/asyncHandler.js";
import morgan from "morgan";
import chalk from "chalk"



export const initApp = (app, express) => {



  if (process.env.Mode == "dev") {
    app.use(morgan("dev"))
  }
  app.get("/", (req, res, next) => {
    res.status(200).json({ msg: "welcome on my project" })
  })
  app.use(express.json());
  app.use("/auth", authRoutes);
  app.use("/users", userRoutes);
  app.use("/categories", categoryRoutes);
  app.use("/subCategories", subCategoryRoutes);
  app.use("/brands", brandRoutes);
  app.use("/products", productRoutes);
  app.use("/coupons", couponRoutes);
  app.use("/carts", cartRoutes);
  app.use("/orders", orderRoutes);
  app.use("/reviews", reviewRoutes);

  //invalid routes
  app.use("*", (req, res, next) => {
    let err = new Error(`${req.originalUrl} is invalid url!`)
    next(err)
  });

  //connection db
  dbConnection();

  //global error handling
  app.use(globalErrorHandling);

  app.listen(port, () => console.log(chalk.cyan(`Example app listening on port ${port}`)));
};
