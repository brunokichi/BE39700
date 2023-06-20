import { Router, json, urlencoded } from "express";
import { UsersController } from "../controller/users.controller.js";
import { SessionController } from "../controller/session.controller.js";

const usersRouter = Router();
usersRouter.use(json());
usersRouter.use(urlencoded({ extended: true }));

usersRouter.get("/premium/:uid", SessionController.loginController, SessionController.checkRol(["Admin"]), UsersController.changeRol);
usersRouter.post("/premium", SessionController.loginController, SessionController.checkRol(["Admin"]), UsersController.changeRol);

export default usersRouter;