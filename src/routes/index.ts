import { Router } from "express";
import authRoutes from "./auth";
import productsRoutes from "./products";
import usersRoutes from "./users";
import cartRouter from "./cart";
import orderRoutes from "./orders";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/products", productsRoutes);
rootRouter.use("/users", usersRoutes);
rootRouter.use("/carts", cartRouter);
rootRouter.use("/orders", orderRoutes);

export default rootRouter;

/* 
1. User management
  a. List users
  c. Get User By Id
  b. Change user role
2. Order management
  a. List all orders (filter on status)
  b. Change order status 
  c. List all orders of given user
3. Products
  a. Search api for products (for both users and admins) => full text search
*/