import express, { urlencoded } from "express";
import handlebars from "express-handlebars";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import chatsRouter from "./routes/chats.router.js";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import { ProductManager, ChatManager } from "./dao/index.js"

import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname+'/views');
app.set("view engine", "handlebars");
app.use("/", viewsRouter);
app.use(express.static(__dirname + "/../public"));

mongoose.connect("mongodb+srv://brunokichi:polcacINnDDw0Zh9@coder.0pay6zu.mongodb.net/ecommerce?retryWrites=true&w=majority").then((conn) => {
    console.log("Conectado a la base de datos!");
  }).catch(() => {
    console.log("Se produjo un error en la conexion a la DB"); 
  });

const httpServer = app.listen(8080, () => {
    console.log("Servidor escuchando en el puerto 8080");
})

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {

    console.log("Cliente conectado!");

    const managerProducts = new ProductManager();
    try {
      const products = await managerProducts.getProducts();
      socket.emit("products", products);
    } catch (e) {
      return e;
    }

    const managerChats = new ChatManager();
    try {
      const chats = await managerChats.getChats();
      socket.emit("chats", chats);
    } catch (e) {
      return e;
    }

    socket.on("chat-message", async (user, message) => {
      try {
        const newChat = await managerChats.addChat(user, message);
        try {
          const chats = await managerChats.getChats();
          socket.emit("chats", chats);
        } catch (e) {
          return e;
        }
      } catch (e) {
        return e;
      }
    });

})

app.use((req, res, next) => {
    req.socketServer = socketServer;
    next();
})

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/chat", chatsRouter);