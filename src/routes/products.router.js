import { Router, json, urlencoded } from "express";
import { ProductController } from "../controller/product.controller.js"
import { SessionController } from "../controller/session.controller.js";
import { uploaderProduct } from "../utils.js";

const productsRouter = Router();
productsRouter.use(json());
productsRouter.use(urlencoded({ extended: true }));

productsRouter.get("/", ProductController.getProducts);
productsRouter.get("/:pid", ProductController.getProductsById);
productsRouter.post("/", SessionController.loginController, SessionController.checkRol(["Admin","Premium"]), uploaderProduct.single("image"), ProductController.addProduct);
productsRouter.put("/:pid", SessionController.loginController, SessionController.checkRol(["Admin"]), ProductController.updateProduct);
productsRouter.delete("/:pid", SessionController.loginController, SessionController.checkRol(["Admin","Premium"]), ProductController.deleteProduct);
export default productsRouter;