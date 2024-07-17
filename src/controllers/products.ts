import { ErrorCode } from "./../exceptions/root";
import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";

export const createProduct = async (req: Request, res: Response) => {
  // ["tea, "india"] => "tea, india"
  // Create a validator to for this request

  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });

  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    if (product.tags) {
      product.tags = product.tags.join(",");
    }
    const updateProduct = await prismaClient.product.update({
      where: {
        id: +req.params.id,
      },
      data: product,
    });
    res.json(updateProduct);
  } catch (error) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};
export const deleteProduct = async (req: Request, res: Response) => {
  await prismaClient.product.delete({
    where: {
      id: +req.params.id,
    },
  });

  res.json({
    success: true,
    message: "Delete product successfully",
  });
};
export const listProducts = async (req: Request, res: Response) => {
  // {
  //   count: 100,
  //   data: []
  // }
  const count = await prismaClient.product.count();

  const skip: number = req.query.skip ? +req.query.skip : 0;
  const take: number = skip ? 5 : count;

  const products = await prismaClient.product.findMany({
    skip: skip,
    take: take,
  });

  res.json({
    count,
    data: products,
  });
};
export const getProductById = async (req: Request, res: Response) => {};
