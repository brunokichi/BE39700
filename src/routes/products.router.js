import { Router, json, urlencoded } from "express";
import { ProductController } from "../controller/product.controller.js"
import { SessionController } from "../controller/session.controller.js";

const productsRouter = Router();
productsRouter.use(json());
productsRouter.use(urlencoded({ extended: true }));

productsRouter.get("/", ProductController.getProducts);
productsRouter.get("/:pid", ProductController.getProductsById);
productsRouter.post("/", SessionController.loginController, SessionController.checkRol(["Admin"]), ProductController.addProduct);
productsRouter.put("/:pid", SessionController.loginController, SessionController.checkRol(["Admin"]), ProductController.updateProduct);
productsRouter.delete("/:pid", SessionController.loginController, SessionController.checkRol(["Admin"]), ProductController.deleteProduct);

export default productsRouter;