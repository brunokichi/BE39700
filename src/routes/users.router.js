import { Router, json, urlencoded } from "express";
import { UsersController } from "../controller/users.controller.js";
import { SessionController } from "../controller/session.controller.js";
import { uploaderProfile, uploaderDocument } from "../utils.js";

const usersRouter = Router();
usersRouter.use(json());
usersRouter.use(urlencoded({ extended: true }));

usersRouter.get("/premium/:uid", SessionController.loginController, SessionController.checkRol(["Admin"]), UsersController.changeRol);
usersRouter.post("/premium", SessionController.loginController, SessionController.checkRol(["Admin"]), UsersController.changeRol);
usersRouter.post("/:uid/avatar", SessionController.loginController, uploaderProfile.single("avatar"), UsersController.uploadAvatar);
usersRouter.post("/:uid/documents", uploaderDocument.fields([{name:"identification",maxCount:1}, {name:"address",maxCount:1}, {name:"account",maxCount:1}]), UsersController.uploadDoc);

export default usersRouter;