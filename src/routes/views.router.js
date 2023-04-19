import express from "express";
import { ProductManager, CartManager, SessionManager } from "../dao/index.js"

const router = express.Router();

const managerCarts = new CartManager();
const managerProducts = new ProductManager();
const managerSessions = new SessionManager();

router.get("/", async (req, res) => {
    /*try {
        const products = await managerProducts.getProducts();
        res.render("home", {
            products,
        });
    } catch (e) {
        return e;
    }*/
    res.redirect("/login");
});

router.get("/login", async (req, res) => {
    const session = req.session.passport;
    if (!session) { 
        const { result } = req.query;
        let mensajeResultado = "";
        switch (result) {
            case '1':
                mensajeResultado = "Error! Algún campo está incompleto";
                break;
            case '2':
                mensajeResultado = "Error! Usuario y/o contraseña incorrecto";
                break;
            case '3':
                mensajeResultado = "Error! No se pudo validar el usuario";
                break;
            case '96':
                mensajeResultado = "Error! No se pudo validar el email"
                break;
            case '97':
                mensajeResultado = "Error! El email ya se encuentra registrado";
                break;
            case '98':
                mensajeResultado = "Error! No se pudo registrar al usuario";
                break;
            case '99':
                mensajeResultado = "Usuario generado de manera exitosa, intente loguearse por favor";
                break;
            default:
                break;
        }
        res.render("login", { mensajeResultado });
    } else {
        res.redirect("/products");
    }
});

router.get("/register", async (req, res) => {
    const user = req.session.user;
    if (!user) { 
        res.render("register");
    } else {
        res.redirect("/products");
    }
});

router.get("/profile", async (req, res) => {
    /*const user = req.session.user;
    if (user) {*/
    if (req.session.passport) {
        try {
            //const { first_name, last_name, email, age, rol } = await managerSessions.profileUser(user);
            const { first_name, last_name, email, age, rol } = await managerSessions.profileUser(req.session.passport.user);
            res.render("profile", { first_name, last_name, email, age, rol } );
        } catch (e) {
            return e;
        }
    } else {
        res.redirect("/");
    }
});

router.get("/logout", async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({ status: "error", data: err});
        }
        res.redirect("/");
    })
});

router.get("/products", async (req, res) => {   
    if (req.session.passport) {
        const { limit, page, sort, title, stock } = req.query;
        try {
            const { email, rol } = await managerSessions.profileUser(req.session.passport.user);
            const products = await managerProducts.getProducts(limit, page, sort, title, stock);
            res.render("products", {
                products, email, rol
            });
        } catch (e) {
            return e;
        }
    } else {
        res.redirect("/");
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

router.get("/realtimeproducts", async (req, res) => {

    res.render("realtimeproducts");

});

router.get("/chat", async (req, res) => {

    res.render("chat");

});

export default router;