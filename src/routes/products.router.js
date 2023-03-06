import { Router, json, urlencoded } from "express";

const productsRouter = Router();
productsRouter.use(json());
productsRouter.use(urlencoded({ extended: true }));

import ProductManager from "../ProductManager.js"

const manager = new ProductManager();

productsRouter.get("/", async (req, res) => {
    const { limit } = req.query;
    const products = await manager.getProducts();

    if (limit) {
        const limitProducts = products.slice(0, limit);
        res.json(limitProducts);
    } else {
        res.json(products);
    }
    
})

productsRouter.get("/:pid", async (req, res) => {
    const product = await manager.getProductsById(+req.params.pid);
    res.send(product);
})

productsRouter.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;
    const newProduct = await manager.addProduct(title, description, code, price, status, stock, category, thumbnail);

    const products = await manager.getProducts();
    req.socketServer.emit("products", products);
    
    res.send(newProduct);
})

productsRouter.put("/:pid", async (req, res) => {
    const id = +req.params.pid;
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;
    const updProduct = await manager.updateProduct(id, title, description, code, price, status, stock, category, thumbnail);
    res.json(updProduct);
})

productsRouter.delete("/:pid", async (req, res) => {
    const id = +req.params.pid;
    const delProduct = await manager.deleteProduct(id);
    res.json(delProduct);
})


export default productsRouter;