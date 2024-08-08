import { Request, Response } from "express";
import { prismaClient } from "..";

export const createOrder = async (req: Request, res: Response) => {
  // 1. To create a transaction
  // 2. To list all the cart items and proceed if cart is not empty
  // 3. Calculate the total amount
  // 4. Fetch address of user
  // 5. To define computed field for formatted address on address module
  // 7. Create event
  // 8. To empty the cart
  return await prismaClient.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        userId: req.user?.id,
      },
      include: {
        product: true,
      },
    });
    if (cartItems.length == 0) {
      return res.json({ message: "Cart is empty" });
    }
    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * +current.product.price;
    }, 0);
    const address = await tx.address.findFirst({
      where: {
        id: req.user!.defaultShippingAddress!,
      },
    });
    const order = await tx.order.create({
      data: {
        userId: req.user?.id!,
        netAmount: price,
        address: address?.formattedAddress!,
        products: {
          create: cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity,
            };
          }),
        },
      },
    });
    const orderEvent = await tx.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });
    await tx.cartItem.deleteMany({
      where: {
        userId: req.user?.id,
      },
    });
    return res.json(order);
  });
};
export const listOrders = async (req: Request, res: Response) => {};
export const cancelOrder = async (req: Request, res: Response) => {};
export const getOrderById = async (req: Request, res: Response) => {};