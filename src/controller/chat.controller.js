import { ChatService } from "../service/chat.service.js";

class ChatController{
    static getChats = async (req,res)=>{
        try {
            const chats = await ChatService.getChats();
            res.json(chats);
        } catch (e) {
            return e;
          }
    };

    static addChat = async (req,res)=>{
        const { user, message } = req.body;
        try {
            const newChat = await ChatService.addChat(user, message);

            try {
                const chats = await ChatService.getChats();
                //req.socketServer.emit("chats", chats);
                res.send(newChat);
            } catch (e) {
                return "Se produjo un error al obtener los mensajes";
            }
        } catch (e) {
            return "Se produjo un error al enviar el mensaje";
        }
        };
}

export { ChatController }