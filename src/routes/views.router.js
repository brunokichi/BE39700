import { Router, json, urlencoded } from "express";
import { ViewsController } from "../controller/views.controller.js"
import { SessionController } from "../controller/session.controller.js"
import passport from "passport";

const router = Router();
router.use(json());
router.use(urlencoded({ extended: true }));

router.get("/", ViewsController.index);
router.get("/addproducts", ViewsController.addProducts);
router.get("/carts/:cid", ViewsController.cartsId);
router.get("/chat", SessionController.loginController, SessionController.checkRol(["Usuario"]), ViewsController.chat);
router.get("/current", SessionController.loginController, ViewsController.profileUser);
router.get("/login", ViewsController.login);
router.get("/logout", ViewsController.logout);
router.get("/register", ViewsController.register);
//router.get("/profile", passport.authenticate("loginJWT" , {session:false, failureRedirect: '/login?result=4'}), ViewsController.profileUser);
//router.get("/products", passport.authenticate("loginJWT" , {session:false, failureRedirect: '/login?result=4'}), ViewsController.getProducts);
router.get("/profile", SessionController.loginController, ViewsController.profileUser);
router.get("/products", SessionController.loginController, ViewsController.getProducts);
router.get("/realtimeproducts", ViewsController.realtimeproducts);


export default router;