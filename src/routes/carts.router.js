import { Router, json, urlencoded } from "express";
import { CartController } from "../controller/cart.controller.js"

const cartsRouter = Router();
cartsRouter.use(json());
cartsRouter.use(urlencoded({ extended: true }));

cartsRouter.get("/", CartController.getCarts);
cartsRouter.get("/:cid", CartController.getCartById);
cartsRouter.post("/", CartController.addCart);
cartsRouter.post("/:cid/product/:pid", CartController.addProductToCart);
cartsRouter.put("/:cid", CartController.putProductsToCart);
cartsRouter.put("/:cid/products/:pid", CartController.updProductFromCart);
cartsRouter.delete("/:cid/products/:pid", CartController.deleteProductFromCart);
cartsRouter.delete("/:cid", CartController.emptyCart);

export default cartsRouter;