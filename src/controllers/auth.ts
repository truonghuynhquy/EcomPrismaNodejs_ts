import { json, NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { nextTick } from "process";
import { error, log } from "console";
import { create } from "domain";
import { UnprocessableEntity } from "../exceptions/validation";
import { SignUpSchema } from "../schema/users";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body;
    SignUpSchema.parse(req.body);

    let user = await prismaClient.user.findFirst({ where: { email } });

    if (user) {
      return next(
        new BadRequestsException(
          "User already exists",
          ErrorCode.USER_ALREADY_EXIST
        )
      );
    }

    user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    });

    res.json(user);
  } catch (error: any) {
    next(
      new UnprocessableEntity(
        error?.issues,
        "Unprocessable entity",
        ErrorCode.UNPROCESSABLE_ENTITY
      )
    );
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    return next(
      new BadRequestsException("User does not exists", ErrorCode.USER_NOT_FOUND)
    );
  }

  if (!compareSync(password, user.password)) {
    return next(
      new BadRequestsException(
        "Passwords do not match",
        ErrorCode.INCORRECT_PASSWORD
      )
    );
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);

  res.json({ user, token });
};
