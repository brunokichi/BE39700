import chatModel from "../models/ChatModel.js";

export default class ChatManager {

  getChats = async () => {
    try {
        const chats = await chatModel.find().lean();
        return chats;
      } catch (e) {
        return "Se produjo un error al buscar los chats";
      }
  };
   
  addChat = async (user, message) => {
    if (!user || !message) {
      return "Error! Algún campo está incompleto";
    } else {
        try {
          const newChat = await chatModel.create({
            user,
            message,
          });
          return "Mensaje enviado";
        } catch (e) {
          return "Se produjo un error al enviar el mensaje";
        }
      }
    }
  };
