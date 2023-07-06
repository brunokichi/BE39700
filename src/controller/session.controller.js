import { SessionService } from "../service/session.service.js";
import { CartController } from "../controller/cart.controller.js";

import jwt from "jsonwebtoken";
import passport from "passport";

import { config } from "../config/config.js";
const tokenSecret = config.token.secret;
const tokenCookie = config.token.cookie;

class SessionController{

    static loginController = (req, res, next) => {
        passport.authenticate("loginJWT",{session:false}, 
            (err, user, info) => {
                
                if (err) return next(err);
                req.user = user;
                if (!user) {
                    res.clearCookie(tokenCookie).redirect("/login?result=4")
                }
                next();
        })(req, res, next);
    }
    
    /*static loginController = passport.authenticate("loginJWT",{
        session:false, 
        failureRedirect:"/login?result=4"
    });*/

    static checkRol = (roles)=>{
        return (req,res,next)=>{
            if(!roles.includes(req.user.rol)){
                return res.clearCookie(tokenCookie).redirect("/login?result=4");
            }
            next();
        }
    }

    static addUser = async (req,res)=>{
        const { first_name, last_name, email, age, password } = req.body;
        try {
            const resUser = await SessionService.addUser(first_name, last_name, email, age, password);
            console.log(resUser);
            if (resUser =='OK99') {
                const resCart = await CartController.addCart();
                const resUserCart = await SessionService.addUserCart(email,resCart);
                res.redirect('/login?result=' + resUserCart);
            }
            res.redirect('/login?result=' + resUser);
        } catch (e) {
            //Se produjo un error al intentar registrar al usuario;
            return "98";
        }
    };

    static loginUser = async (req,res)=>{
        const { user, password } = req.body;
        try {
            const resLogin = await SessionService.loginUser(user, password);
            if (!resLogin.email){
                res.redirect('/login?result=' + resLogin);
            } else {
                const token = jwt.sign({_id: resLogin._id, first_name: resLogin.first_name, email: resLogin.email, rol: resLogin.rol, cart: resLogin.cart}, tokenSecret, {expiresIn:"24h"});
                res.cookie(tokenCookie, token,{
                    httpOnly:true
                })
                
                res.redirect("/products");
            }
        } catch (e) {
            //Se produjo un error al validar el usuario;
            return "3";
        }
    };

    static forgotPassword = async (req,res)=>{
        const { user } = req.body;
        const resForgotPassword = await SessionService.forgotPassword(user);
        res.redirect('/forgotpassword?result=' + resForgotPassword);
    };

    static resetPassword = async (req,res)=>{
        const token = req.query.token;
        const { user, password } = req.body;
        const resResetPassword = await SessionService.resetPassword(token, user, password);
        if (resResetPassword == "OK98"){
            res.redirect('/login?result=' + resResetPassword);
        }
        else {
            res.redirect('/resetpassword?user=' + user + '&token=' + token + '&result=' + resResetPassword);
        }
    };

    static currentUser = (req,res)=>{
        if(req.user){
            return res.send({userInfo: req.user});
        }
    }

    static loginGithub = async (req, res) => {
        //
    }

    static loginGithubCallback = async (req, res) => {
        req.session.user = req.user;
        res.redirect("/login");
    }

    static registerSession = async (req, res) => {
        const resUser = "OK99";
        res.redirect('/login?result=' + resUser);
    };

    static loginSession = async (req, res) => {
        if (!req.user) {
            res.redirect('/login?result=3');
        }
        res.cookie(tokenCookie, token,{
            httpOnly:true
        });
        res.redirect("/products");
    };
    
}

export { SessionController }