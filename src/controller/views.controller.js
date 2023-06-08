import { ViewsService } from "../service/views.service.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import { MError } from "../service/errors/enums.js";

import { ProductManager, CartManager, SessionManager } from "../dao/index.js"
const managerSessions = new SessionManager();
const managerProducts = new ProductManager();

import { config } from "../config/config.js";
const tokenCookie = config.token.cookie;

class ViewsController{
    static index = (req, res) => {
        //console.log(req.user);
        res.redirect("/login");
    }

    static login = (req,res)=>{
        const login = req.cookies[tokenCookie];
        if(login){
            res.redirect("/products");
        } else {
        //console.log(req.session.passport);
        // if (!session) {
            const { result } = req.query;
            let mensajeResultado = "";
            if (result) {
                if (result == "99") {
                    mensajeResultado = "Usuario generado de manera exitosa, intente loguearse por favor";
                } else {
                    mensajeResultado = MError[result];
                }
            }
            res.render("login", { mensajeResultado });
        }/* else {
            res.redirect("/products");
        }*/
    }

    static logout = async (req, res) => {
        req.logout((err)=>{
            if (err) {
                return res.status(500).send({ status: "error", data: err});
            }
            res.clearCookie(tokenCookie);
            res.redirect("/");
        });
    }

    static register = async (req, res) => {
        const login = req.cookies[tokenCookie];
        if (!login) { 
            res.render("register");
        } else {
            res.redirect("/products");
        }
    }

    static profileUser = async (req, res) =>{
        try {
            const { first_name, last_name, email, age, rol, cart } = await ViewsService.profileUser(req.user._id);
            res.render("profile", { first_name, last_name, email, age, rol, cart } );
        } catch (e) {
            return e;
        }
    }

    static getProducts = async (req, res) =>{
        const { limit, page, sort, title, stock } = req.query;
        try {
            const { email, rol, cart } = req.user;
            const products = await ViewsService.getProducts(limit, page, sort, title, stock);
            res.render("products", {
                products, email, rol, cart
            });
        } catch (e) {
            return e;
        }
    }

    static cartsId = async (req, res) =>{
        const cartID = req.params.cid;
        try {
            const cart = await ViewsService.getCartById(req.params.cid);
            const products = cart.products;
            res.render("carts", { products, cartID});
        } catch (e) {
            return e;
        }
    }

    static realtimeproducts = async (req, res) => {
        res.render("realtimeproducts");
    }

    static chat = async (req, res) => {
        res.render("chat");
    }

    static addProducts = async (req, res) => {
        res.render("addproducts");
    }

    static mockingproducts = async (req, res) =>{
        try {
            const products = await ViewsService.mockingproducts();
            res.render("mocking", { products });
        } catch (e) {
            return e;
        }
    }

    static loggerTest = async (req, res) => {
        //logger.debug("Nivel debug");
        const loggerTest = await ViewsService.loggerTest();
        res.render("logger");
    }
}

export { ViewsController }