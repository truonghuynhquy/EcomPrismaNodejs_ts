import { ErrorCode } from "./../exceptions/root";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
import { User } from "@prisma/client";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Extract the token from the header
  const token = req.headers.authorization;
  // 2. If token is not present, throw an error of unauthorized
  if (!token) {
    return next(
      new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
    );
  }
  try {
    // 3. If token is present, verify the token and extract the payload
    const payload = jwt.verify(token, JWT_SECRET) as any;
    // 4. To get the user from the payload
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    if (!user) {
      return next(
        new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
      );
    }
    // 5. To attach the user to the current request object
    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};

export default authMiddleware;
