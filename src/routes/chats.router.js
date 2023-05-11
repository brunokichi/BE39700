import { Router, json, urlencoded } from "express";
import { ChatController } from "../controller/chat.controller.js"

const chatsRouter = Router();
chatsRouter.use(json());
chatsRouter.use(urlencoded({ extended: true }));

chatsRouter.get("/", ChatController.getChats);
chatsRouter.post("/", ChatController.addChat);

export default chatsRouter;