import { json, Request, Response } from "express";
import { CreateCartSchema } from "../schema/cart";
import { Product } from "@prisma/client";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { prismaClient } from "..";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { create } from "domain";
import { parse } from "path";
import { BadRequestsException } from "../exceptions/bad-requests";
import { InternalException } from "../exceptions/internal-exception";

export const addItemToCart = async (req: Request, res: Response) => {
  // Validate that the user is adding his or her own cart items
  const userId = req.user?.id; // Let's say you have user authentication middleware
  if (!userId) {
    throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);
  }

  // Validate input data
  const validatedData = CreateCartSchema.parse(req.body);

  // Check product existence
  let product: Product;
  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: validatedData.productId,
      },
    });
  } catch (error) {
    throw new NotFoundException(
      "Product not found!",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }

  // Check for the existence of the same product in user's cart and alter the quantity as required
  const existingCartItem = await prismaClient.cartItem.findFirst({
    where: {
      userId: userId,
      productId: product.id,
    },
  });

  if (existingCartItem) {
    // Update the number of products in the cart
    const updateCartItem = await prismaClient.cartItem.update({
      where: {
        id: existingCartItem.id,
      },
      data: {
        quantity: existingCartItem.quantity + validatedData.quantity,
      },
    });
    res.json(updateCartItem);
  } else {
    // Create a new cart item
    const newCartItem = await prismaClient.cartItem.create({
      data: {
        userId: req.user!.id,
        productId: product.id,
        quantity: validatedData.quantity,
      },
    });
    res.json(newCartItem);
  }
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
  // Check if user is deleting its own cart item
  const userId = req.user?.id; // Let's say you have user authentication middleware
  if (!userId) {
    throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);
  }

  const cartItem = await prismaClient.cartItem.findUnique({
    where: {
      id: +req.params.id,
    },
  });
  if (!cartItem) {
    throw new NotFoundException(
      "Cart Item not found!",
      ErrorCode.CART_ITEM_NOT_FOUND
    );
  }

  if (cartItem.userId !== userId) {
    throw new BadRequestsException(
      "Forbidden: You can only delete your own cart items",
      ErrorCode.CART_ITEM_DOES_NOT_BELONG
    );
  }
  await prismaClient.cartItem.delete({
    where: {
      id: +req.params.id,
    },
  });

  res.json({
    success: true,
    message: "Delete Successfully",
  });
};

export const changeQuantity = async (req: Request, res: Response) => {};

export const getCart = async (req: Request, res: Response) => {};
