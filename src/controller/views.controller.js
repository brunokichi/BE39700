import { ViewsService } from "../service/views.service.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import { MError } from "../service/errors/enums.js";

import { ProductManager, CartManager, SessionManager } from "../dao/index.js"
//const managerSessions = new SessionManager();
//const managerProducts = new ProductManager();

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
                if (result == "OK99") {
                    mensajeResultado = "Usuario generado de manera exitosa, intente loguearse por favor";
                } else if (result == "OK98") {
                    mensajeResultado = "Contraseña actualizada correctamente, intente loguearse por favor";
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
        const { _id } = req.user;
        req.logout(async (err)=>{
            if (err) {
                return res.status(500).send({ status: "error", data: err});
            }
            const logout = await ViewsService.logoutUser(_id);
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

    static forgotpassword = async (req, res) => {
        const { result } = req.query;
        let mensajeResultado = "";
        if (result) {
            if (result == "OK99") {
                mensajeResultado = "Revise su correo, se envió un mail a su cuenta para continuar con el reinicio de la contraseña";
            } else {
                mensajeResultado = MError[result];
            }
        }
        res.render("forgotpassword", { mensajeResultado });
    }

    static resetpassword = async (req, res) => {
        const { user, token, result } = req.query;
        let mensajeResultado = "";
        if (result) {
            mensajeResultado = MError[result];
        }
        res.render("resetpassword", { user, token, mensajeResultado });
    }

    static changerol = async (req, res) => {
        const { result } = req.query;
        let mensajeResultado = "";
        if (result) {
            if (MError[result]) {
                mensajeResultado = MError[result];
            } else {
                mensajeResultado = 'Rol modificado a ' + result;
            }
            
        }
        res.render("changerol", { mensajeResultado });
    }

    static adminUsers = async (req, res) => {
        const { result } = req.query;
        let mensajeResultado = "";
        try {
            if (result) {
                if (MError[result]) {
                    mensajeResultado = MError[result];
                } else {
                    mensajeResultado = 'Rol modificado a ' + result;
                }
            }
            const {  _id } = req.user;
            const users = await ViewsService.adminUsers();
            res.render("adminusers", { users, _id, mensajeResultado });
        } catch (e) {
            return e;
        }
    }

    static profileUser = async (req, res) =>{
        try {
            const { result } = req.query;
            let mensajeResultado = "";
            if (result) {
                if (result == "OK99") {
                    mensajeResultado = "Operación exitosa";
                } else {
                    mensajeResultado = MError[result];
                }
            }
            const { _id, first_name, last_name, email, age, rol, cart, avatar } = await ViewsService.profileUser(req.user._id);
            res.render("profile", { _id, first_name, last_name, email, age, rol, cart, avatar, mensajeResultado } );
        } catch (e) {
            return e;
        }
    }

    static getProducts = async (req, res) =>{
        const { limit, page, sort, title, stock, result } = req.query;
        let mensajeResultado = "";
        try {
            if (result) {
                if (result == "OK99") {
                    mensajeResultado = "Producto cargado de manera exitosa";
                } else {
                    mensajeResultado = MError[result];
                }
            }
            const { email, rol, cart } = req.user;
            const products = await ViewsService.getProducts(limit, page, sort, title, stock);
            res.render("products", {
                products, email, rol, cart, mensajeResultado
            });
        } catch (e) {
            return e;
        }
    }

    static cartsId = async (req, res) =>{
        const cart = req.params.cid;
        const { email, rol } = req.user;
        try {
            const cartUser = await ViewsService.getCartById(req.params.cid);
            const products = cartUser.products;
            res.render("cart", { email, rol, products, cart});
        } catch (e) {
            return e;
        }
    }

    static cart = async (req, res) =>{
        const { result } = req.query;
        let mensajeResultado = "";
        if (result) {
            if (result == "OK99") {
                mensajeResultado = "Cantidad modificada correctamente";
            } else if (result == "OK98") {
                mensajeResultado = "Producto eliminado correctamente";
            } else if (result == "OK97") {
                mensajeResultado = "Carrito vaciado correctamente";
            }else {
                mensajeResultado = MError[result];
            }
        }
        const { email, rol, cart } = req.user;
        try {
            const cartUser = await ViewsService.getCartById(cart);
            const products = cartUser.products;
            res.render("cart", { email, rol, products, cart, mensajeResultado});
        } catch (e) {
            return e;
        }
    }

    static purchase = async (req, res) =>{
        const { result, tid } = req.query;
        const { email, rol, cart } = req.user;
        let mensajeResultado = "";
        if (result) {
            mensajeResultado = MError[result];
            res.render("purchase", { email, rol, mensajeResultado});
        }
        try {
            mensajeResultado = "Compra exitosa!";
            const cartUser = await ViewsService.getCartById(cart);
            const ticketUser = await ViewsService.getTicketById(tid);
            const cartProducts = cartUser.products;
            const ticketProducts = ticketUser.products;
            const amount = ticketUser.amount;
            res.render("purchase", { email, rol, cartProducts, ticketProducts, amount, mensajeResultado});
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