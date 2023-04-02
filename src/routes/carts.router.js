import { Router, json, urlencoded } from "express";

const cartsRouter = Router();
cartsRouter.use(json());
cartsRouter.use(urlencoded({ extended: true }));

import { CartManager } from "../dao/index.js";

const manager = new CartManager();

cartsRouter.get("/", async (req, res) => {
    try {
        const carts = await manager.getCarts();
        res.json(carts);
    } catch (e) {
        return e;
      }
})

cartsRouter.get("/:cid", async (req, res) => {
    try {
        const cart = await manager.getCartById(req.params.cid);
        res.json(cart);
    } catch (e) {
        return e;
    }
})

cartsRouter.post("/", async (req, res) => {
    try {
        const newCart = await manager.addCart();
        res.send(newCart);
    } catch (e) {
        return e;
    }
})

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    try {
        const product = await manager.addProductToCart(req.params.cid, req.params.pid);
        res.send(product);
    } catch (e) {
        return e;
    }
})

cartsRouter.put("/:cid", async (req, res) => {
    const products = req.body;
    try {
        const cart = await manager.putProductsToCart(req.params.cid, products);
        res.json(cart);
    } catch (e) {
        return e;
    }
})

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
    const { quantity } = req.body;
    try {
        const cart = await manager.updProductFromCart(req.params.cid, req.params.pid, quantity);
        res.json(cart);
    } catch (e) {
        return e;
    }
})

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const delProduct = await manager.deleteProductFromCart(req.params.cid, req.params.pid);
        res.json(delProduct);
    } catch (e) {
        return "Se produjo un error al eliminar el producto del carrito";
    }
})

cartsRouter.delete("/:cid", async (req, res) => {
    try {
        const delProduct = await manager.emptyCart(req.params.cid);
        res.json(delProduct);
    } catch (e) {
        return "Se produjo un error al vaciar el carrito";
    }
})

export default cartsRouter;