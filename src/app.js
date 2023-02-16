import express from "express"
import ProductManager from "./ProductManager.js"

const manager = new ProductManager();

const app = express();

app.get("/products", async (req, res) => {
    const { limit } = req.query;
    const products = await manager.getProducts();

    if (limit) {
        const limitProducts = products.slice(0, limit);
        res.json(limitProducts);
    } else {
        res.json(products);
    }
    
})

app.get("/products/:pid", async (req, res) => {
    const product = await manager.getProductsById(+req.params.pid);
    res.send(product);
})

app.listen(8080, () => {
    console.log("Servidor escuchando en el puerto 8080");
})