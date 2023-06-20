import { Router, json, urlencoded } from "express";
import { SessionController } from "../controller/session.controller.js";

import passport from "passport";

const sessionsRouter = Router();
sessionsRouter.use(json());
sessionsRouter.use(urlencoded({ extended: true }));

sessionsRouter.get("/current",  passport.authenticate("loginJWT" , {session:false, failureRedirect: '/login?result=4'} ), SessionController.currentUser);
sessionsRouter.get("/github", passport.authenticate("github", {scope: ["user:email"]}), SessionController.loginGithub);
sessionsRouter.get("/github-callback", passport.authenticate("github", {failureRedirect: '/login?result=96'}), SessionController.loginGithubCallback);
sessionsRouter.post("/forgotpassword", SessionController.forgotPassword);
sessionsRouter.post("/login", SessionController.loginUser);
sessionsRouter.post("/loginSession", passport.authenticate("loginLocal", { failureRedirect: '/login?result=2'}), SessionController.loginSession);
sessionsRouter.post("/register", SessionController.addUser);
sessionsRouter.post("/registerSession", passport.authenticate("registerLocal", { failureRedirect: '/login?result=98'}), SessionController.registerSession);
sessionsRouter.post("/resetpassword", SessionController.resetPassword);

export default sessionsRouter;