import { Router, json, urlencoded } from "express";
import { CartController } from "../controller/cart.controller.js";
import { SessionController } from "../controller/session.controller.js"

const cartsRouter = Router();
cartsRouter.use(json());
cartsRouter.use(urlencoded({ extended: true }));

cartsRouter.get("/", CartController.getCarts);
cartsRouter.get("/:cid", CartController.getCartById);
cartsRouter.post("/", CartController.addCart);
cartsRouter.post("/:cid/product/:pid", SessionController.loginController, CartController.addProductToCart);
cartsRouter.post("/:cid/purchase", SessionController.loginController, CartController.purchase);
cartsRouter.put("/:cid", CartController.putProductsToCart);
cartsRouter.put("/:cid/products/:pid", CartController.updProductFromCart);
cartsRouter.delete("/:cid/products/:pid", CartController.deleteProductFromCart);
cartsRouter.delete("/:cid", CartController.emptyCart);

export default cartsRouter;