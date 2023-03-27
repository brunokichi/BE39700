import { Router, json, urlencoded } from "express";

const chatsRouter = Router();
chatsRouter.use(json());
chatsRouter.use(urlencoded({ extended: true }));

import { ChatManager } from "../dao/index.js";

const manager = new ChatManager();

chatsRouter.get("/", async (req, res) => {
    try {
        const chats = await manager.getChats();
        res.json(chats);  
    } catch (e) {
        return "Se produjo un error al obtener los mensajes";
    }
})

chatsRouter.post("/", async (req, res) => {
    const { user, message } = req.body;
    try {
        const newChat = await manager.addChat(user, message);

        try {
            const chats = await manager.getChats();
            req.socketServer.emit("chats", chats);
    
            res.send(newChat);
        } catch (e) {
            return "Se produjo un error al obtener los mensajes";
        }
    } catch (e) {
        return "Se produjo un error al enviar el mensaje";
    }
})

export default chatsRouter;