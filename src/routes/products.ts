import { Product } from "@prisma/client";
import { Router } from "express";
import { errorHandler } from "../error-handler";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  searchProduct,
  updateProduct,
} from "../controllers/products";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";

const productsRoutes: Router = Router();

productsRoutes.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(createProduct)
);
productsRoutes.put(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateProduct)
);
productsRoutes.delete(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteProduct)
);
productsRoutes.get(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(listProducts)
);
productsRoutes.get(
  "/search",
  [authMiddleware, adminMiddleware],
  errorHandler(searchProduct)
);
productsRoutes.get(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(getProductById)
);

export default productsRoutes;
