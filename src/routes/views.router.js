import express from "express";
import { ProductManager, CartManager } from "../dao/index.js"

const router = express.Router();

const managerCarts = new CartManager();
const managerProducts = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const products = await managerProducts.getProducts();
        res.render("home", {
            products,
        });
    } catch (e) {
        return e;
    }
});

router.get("/realtimeproducts", async (req, res) => {

    res.render("realtimeproducts");

});

router.get("/chat", async (req, res) => {

    res.render("chat");

});

router.get("/products", async (req, res) => {
    const { limit, page, sort, title, stock } = req.query;
    try {
        const products = await managerProducts.getProducts(limit, page, sort, title, stock);
        res.render("products", {
            products, 
        });
    } catch (e) {
        return e;
    }
});

router.get("/carts/:cid", async (req, res) => {
    const cartID = req.params.cid;
    try {
        const cart = await managerCarts.getCartById(req.params.cid);
        const products = cart.products;
        res.render("carts", { products, cartID});
    } catch (e) {
        return e;
    }
});

export default router;