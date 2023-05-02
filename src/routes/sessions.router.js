import { Router, json, urlencoded } from "express";//
import { SessionManager } from "../dao/index.js";//
import passport from "passport";
import jwt from "jsonwebtoken";

const sessionsRouter = Router();
sessionsRouter.use(json());
sessionsRouter.use(urlencoded({ extended: true }));

const secret = "coder-secret";

const manager = new SessionManager();

sessionsRouter.post("/registerSession", 
    passport.authenticate("registerLocal", 
    {
        failureRedirect: '/login?result=98',
    }),
    async (req, res) => {
        const resUser = "99";
        res.redirect('/login?result=' + resUser);
    }
)

sessionsRouter.post("/loginSession", 
    passport.authenticate("loginLocal", {
        failureRedirect: '/login?result=2'
    }),
    async (req, res) => {
        if (!req.user) {
            res.redirect('/login?result=3');
        }
        res.cookie(options.server.cookieToken, token,{
            httpOnly:true
        });
        res.redirect("/products");
    }
)

sessionsRouter.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const resUser = await manager.addUser(first_name, last_name, email, age, password);
        res.redirect('/login?result=' + resUser);
    } catch (e) {
        //Se produjo un error al intentar registrar al usuario;
        return "98";
    }
})

sessionsRouter.post("/login", async (req, res) => {
    const { user, password } = req.body;
    
    try {
        const resLogin = await manager.loginUser(user, password);
        if (!resLogin.email){
            res.redirect('/login?result=' + resLogin);
        } else {
            if (resLogin.email === "adminCoder@coder.com") {
                resLogin.rol = "Admin";
                resLogin._id = "1";
                resLogin.first_name = "Admin Coder";
            }
            const token = jwt.sign({_id: resLogin._id, first_name: resLogin.first_name, email: resLogin.email, rol: resLogin.rol}, secret, {expiresIn:"24h"});
            res.cookie("coder-cookie", token,{
                httpOnly:true
            })
            res.redirect("/products");
        }
    } catch (e) {
        //Se produjo un error al validar el usuario;
        return "3";
    }
})

sessionsRouter.get("/current", passport.authenticate("loginJWT" , {session:false, failureRedirect: '/login?result=4'} ),(req,res)=>{
    if(req.user){
        return res.send({userInfo: req.user});
    }
});

sessionsRouter.get("/github", 
    passport.authenticate("github", {scope: ["user:email"]}),
    async (req, res) => {
        //
    }
)

sessionsRouter.get("/github-callback",
    passport.authenticate("github", {
        failureRedirect: '/login?result=96'
    }),
    async (req, res) => {
        req.session.user = req.user;
        res.redirect("/login");
    }
)

/*
sessionsRouter.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const resUser = await manager.addUser(first_name, last_name, email, age, password);
        res.redirect('/login?result=' + resUser);
    } catch (e) {
        //Se produjo un error al intentar registrar al usuario;
        return "98";
    }
})*/

/*sessionsRouter.post("/login", async (req, res) => {
    const { user, password } = req.body;
    
    try {
        const resLogin = await manager.loginUser(user, password);
        if (!resLogin.email){
            res.redirect('/login?result=' + resLogin);
        } else {
            req.session.user=resLogin.email;
            if (resLogin.email === "adminCoder@coder.com") {
                req.session.rol = true;
            } else {
                req.session.rol = false;
            }
            return res.redirect("/products");
        }
    } catch (e) {
        //Se produjo un error al validar el usuario;
        return "3";
    }
})*/

export default sessionsRouter;