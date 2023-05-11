import { Router, json, urlencoded } from "express";
import { ViewsController } from "../controller/views.controller.js"
import passport from "passport";

const router = Router();
router.use(json());
router.use(urlencoded({ extended: true }));

router.get("/", ViewsController.index);
router.get("/login", ViewsController.login);
router.get("/logout", ViewsController.logout);
router.get("/register", ViewsController.register);
router.get("/profile", passport.authenticate("loginJWT" , {session:false, failureRedirect: '/login?result=4'}), ViewsController.profileUser);
router.get("/products", passport.authenticate("loginJWT" , {session:false, failureRedirect: '/login?result=4'}), ViewsController.getProducts);
router.get("/carts/:cid", ViewsController.cartsId);
router.get("/realtimeproducts", ViewsController.realtimeproducts);
router.get("/chat", ViewsController.chat);

export default router;