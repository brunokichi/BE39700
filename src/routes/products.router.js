import { Router, json, urlencoded } from "express";
import { ProductController } from "../controller/product.controller.js"

const productsRouter = Router();
productsRouter.use(json());
productsRouter.use(urlencoded({ extended: true }));

productsRouter.get("/", ProductController.getProducts);
productsRouter.get("/:pid", ProductController.getProductsById);
productsRouter.post("/", ProductController.addProduct);
productsRouter.put("/:pid", ProductController.updateProduct);
productsRouter.delete("/:pid", ProductController.deleteProduct);

export default productsRouter;