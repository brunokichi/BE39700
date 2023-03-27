import FileProductManager from "./file-managers/ProductManager.js";
import DbProductManager from "./db-managers/ProductManager.js";
import FileCartManager from "./file-managers/CartManager.js";
import DbCartManager from "./db-managers/CartManager.js";
import DbChatManager from "./db-managers/ChatManager.js";

const config = {
  persistenceType: "file",
};

let ProductManager, CartManager, ChatManager;

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

export { ProductManager, CartManager, ChatManager };
