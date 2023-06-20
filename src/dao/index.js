import FileProductManager from "./file-managers/ProductManager.js";
import DbProductManager from "./db-managers/ProductManager.js";
import FileCartManager from "./file-managers/CartManager.js";
import DbCartManager from "./db-managers/CartManager.js";
import DbChatManager from "./db-managers/ChatManager.js";
import DbSessionManager from "./db-managers/SessionManager.js";
import DBTicketManager from "./db-managers/TicketManager.js";
import DBUserManager from "./db-managers/UserManager.js";

const config = {
  persistenceType: "db",
};

let ProductManager, CartManager, ChatManager, SessionManager, TicketManager, UserManager;

if (config.persistenceType === "db") {
  ProductManager = DbProductManager;
  CartManager = DbCartManager;
} else if (config.persistenceType === "file") {
  ProductManager = FileProductManager;
  CartManager = FileCartManager;
} else {
  throw new Error("Tipo de persistencia incorrecto");
}

ChatManager = DbChatManager;
SessionManager = DbSessionManager;
TicketManager = DBTicketManager;
UserManager = DBUserManager;

export { ProductManager, CartManager, ChatManager, SessionManager, TicketManager, UserManager };
