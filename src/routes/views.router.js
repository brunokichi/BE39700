import { Router, json, urlencoded } from "express";
import { ViewsController } from "../controller/views.controller.js";
import { SessionController } from "../controller/session.controller.js";
import passport from "passport";

const router = Router();
router.use(json());
router.use(urlencoded({ extended: true }));

router.get("/", ViewsController.index);
router.get("/addproducts", ViewsController.addProducts);
router.get("/adminusers", SessionController.loginController, SessionController.checkRol(["Admin"]), ViewsController.adminUsers);
router.get("/cart", SessionController.loginController, ViewsController.cart);
router.get("/carts/:cid", SessionController.loginController, ViewsController.cartsId);
router.get("/chat", SessionController.loginController, SessionController.checkRol(["Usuario"]), ViewsController.chat);
router.get("/current", SessionController.loginController, ViewsController.profileUser);
router.get("/forgotpassword", ViewsController.forgotpassword);
router.get("/loggertest", ViewsController.loggerTest);
router.get("/login", ViewsController.login);
router.get("/logout", SessionController.loginController, ViewsController.logout);
router.get("/mockingproducts", ViewsController.mockingproducts);
//router.get("/changerol", ViewsController.changerol);
router.get("/profile", SessionController.loginController, ViewsController.profileUser);
router.get("/products", SessionController.loginController, ViewsController.getProducts);
router.get("/purchase", SessionController.loginController, ViewsController.purchase);
router.get("/realtimeproducts", ViewsController.realtimeproducts);
router.get("/register", ViewsController.register);
router.get("/resetpassword", ViewsController.resetpassword);



export default router;