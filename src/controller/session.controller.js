import { SessionService } from "../service/session.service.js";

import jwt from "jsonwebtoken";

import { config } from "../config/config.js";
const tokenSecret = config.token.secret;
const tokenCookie = config.token.cookie;

class SessionController{
    
    static addUser = async (req,res)=>{
        const { first_name, last_name, email, age, password } = req.body;
        try {
            const resUser = await SessionService.addUser(first_name, last_name, email, age, password);
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
                const token = jwt.sign({_id: resLogin._id, first_name: resLogin.first_name, email: resLogin.email, rol: resLogin.rol}, tokenSecret, {expiresIn:"24h"});
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
        const resUser = "99";
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