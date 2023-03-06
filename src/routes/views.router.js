import express from "express";

import ProductManager from "../ProductManager.js"

const router = express.Router();

const manager = new ProductManager();

router.get("/", async (req, res) => {
    const products = await manager.getProducts();

    res.render("home", {
        products,
    });
});

router.get("/realtimeproducts", async (req, res) => {

    res.render("realtimeproducts");

});

export default router;