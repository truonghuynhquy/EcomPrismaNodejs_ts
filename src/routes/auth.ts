import { Router } from "express";
import { signup, login, me } from "../controllers/auth";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";

const authRoutes: Router = Router();

authRoutes.post("/signup", errorHandler(signup) as any);
authRoutes.post("/login", errorHandler(login) as any);
authRoutes.get("/me", [authMiddleware] as any, errorHandler(me) as any);

export default authRoutes;
