import { Request, Response } from "express";
import { AddressSchema } from "../schema/users";
import { User } from "@prisma/client";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { prismaClient } from "..";

export const addAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);

  let user: User;
  try {
    user = await prismaClient.user.findFirstOrThrow({
      where: {
        id: req.body.userId,
      },
    });
  } catch (error) {
    throw new NotFoundException("User not found.", ErrorCode.USER_NOT_FOUND);
  }

  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: user.id,
    },
  });

  res.json(address);
};
export const deleteAddress = async (req: Request, res: Response) => {};
export const listAddress = async (req: Request, res: Response) => {};