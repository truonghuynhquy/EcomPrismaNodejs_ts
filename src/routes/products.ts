import { Router } from "express";
import { errorHandler } from "../error-handler";
import { createProduct } from "../controllers/products";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";

const productsRoutes: Router = Router();

productsRoutes.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(createProduct)
);

export default productsRoutes;
