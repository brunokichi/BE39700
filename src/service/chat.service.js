import { ChatManager } from "../dao/index.js";

const manager = new ChatManager();

class ChatService{
    static getChats = ()=>{
        const chats =  manager.getChats();
        return chats;
    }

    static addChat = ()=>{
        const newCart =  manager.addChat(user, message);
        return newCart;
    }
}

export { ChatService }