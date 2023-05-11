import { ViewsService } from "../service/views.service.js";

import { ProductManager, CartManager, SessionManager } from "../dao/index.js"
const managerSessions = new SessionManager();
const managerProducts = new ProductManager();

import { config } from "../config/config.js";
const tokenCookie = config.token.cookie;

class ViewsController{
    static index = (req, res) => {
        res.redirect("/login");
    }
    
    static login = (req,res)=>{
        const session = req.session.passport;
        console.log(session);
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
                case '4':
                    mensajeResultado = "Error! Acceso no autorizado";
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
        const user = req.session.user;
        if (!user) { 
            res.render("register");
        } else {
            res.redirect("/products");
        }
    }

    static profileUser = async (req, res) =>{
        try {
            const { first_name, last_name, email, age, rol } = await ViewsService.profileUser(req.user._id);
            res.render("profile", { first_name, last_name, email, age, rol } );
        } catch (e) {
            return e;
        }
    }

    static getProducts = async (req, res) =>{
        const { limit, page, sort, title, stock } = req.query;
        try {
            const { email, rol } = req.user;
            const products = await ViewsService.getProducts(limit, page, sort, title, stock);
            res.render("products", {
                products, email, rol
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
}

export { ViewsController }