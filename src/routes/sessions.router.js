import { Router, json, urlencoded } from "express";

const sessionsRouter = Router();
sessionsRouter.use(json());
sessionsRouter.use(urlencoded({ extended: true }));

import { SessionManager } from "../dao/index.js";

const manager = new SessionManager();

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
})

export default sessionsRouter;