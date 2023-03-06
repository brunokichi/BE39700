import { Router, json, urlencoded } from "express";

const cartsRouter = Router();
cartsRouter.use(json());
cartsRouter.use(urlencoded({ extended: true }));

import CartManager from "../CartManager.js"

const manager = new CartManager();

cartsRouter.get("/", async (req, res) => {
    const carts = await manager.getCarts();
    res.json(carts);
})

cartsRouter.get("/:cid", async (req, res) => {
    const cart = await manager.getCartById(+req.params.cid);
    res.json(cart);
})

cartsRouter.post("/", async (req, res) => {
    const { products } = req.body;
    const newCart = await manager.addCart( products );
    res.send(newCart);
})

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    const product = await manager.addProductToCart(+req.params.cid, +req.params.pid);
    res.send(product);
})

export default cartsRouter;