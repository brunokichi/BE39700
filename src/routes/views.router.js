import express from "express";
import { ProductManager } from "../dao/index.js"

const router = express.Router();

const manager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const products = await manager.getProducts();
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

export default router;