import { Router, json, urlencoded } from "express";

const productsRouter = Router();
productsRouter.use(json());
productsRouter.use(urlencoded({ extended: true }));

import { ProductManager } from "../dao/index.js";

const manager = new ProductManager();

productsRouter.get("/", async (req, res) => {
    const { limit, page, sort, title, stock } = req.query;
    try {
        const products = await manager.getProducts(limit, page, sort, title, stock);

        res.status(201).send({ status: "success", payload: products });
    } catch (e) {
        return res
            .status(400)
            .send({ status: "error", payload: "Se produjo un error al obtener los productos" });
    }
    
})

productsRouter.get("/:pid", async (req, res) => {
    try {
        const product = await manager.getProductsById(req.params.pid);
        res.send(product);
    } catch (e) {
        return "Se produjo un error al obtener el producto";
    }
})

productsRouter.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;
    try {
        const newProduct = await manager.addProduct(title, description, code, price, status, stock, category, thumbnail);
        try {
            const products = await manager.getProducts();
            req.socketServer.emit("products", products.docs);
            res.send(newProduct);
        } catch (e) {
            return "Se produjo un error al obtener los productos";
        }
    } catch (e) {
        return "Se produjo un error al agregar el producto";
    }
})

productsRouter.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const updateProductData = req.body;
    
    try {
        const updProduct = await manager.updateProduct(id, updateProductData);
        res.json(updProduct);
    } catch (e) {
        return "Se produjo un error al actualizar el producto";
    }
    
})

productsRouter.delete("/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const delProduct = await manager.deleteProduct(id);
        res.json(delProduct);
    } catch (e) {
        return "Se produjo un error al eliminar el producto";
    }
})


export default productsRouter;