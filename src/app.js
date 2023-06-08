import express, { urlencoded } from "express";
import handlebars from "express-handlebars";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import chatsRouter from "./routes/chats.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";

import { Server } from "socket.io";
import { ProductManager, ChatManager } from "./dao/index.js"

import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";

import passport from "passport";
import { initializePassport } from "./config/passport.config.js";

import cookieParser from "cookie-parser";

import { config } from "./config/config.js";
const port = config.server.port;
const database = config.db.mongoUrl;
const tokenSecret = config.token.secret;

import { errorHandler } from "./utils/errorHandler.js";

import { addLogger, currentEnv } from "./utils/logger.js";
const logger = addLogger();
logger.info(`Env: ${currentEnv} - ${new Date().toLocaleTimeString()}`);

const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname+'/views');
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/../public"));
app.use(cookieParser());

const main = async () => {
  mongoose
    .connect(database)
    .then((conn) => {
      console.log("Conectado a la base de datos!");
    })
    .catch(() => {
      console.log("Se produjo un error en la conexion a la DB"); 
    });
  
};

main();

app.use(session({
  store:MongoStore.create({
      mongoUrl:database,
      ttl: 24 * 60 * 60,
  }),
  secret:tokenSecret,
  resave:true,
  saveUninitialized:true
}))

const httpServer = app.listen(port, () => {
    console.log("Servidor escuchando en el puerto 8080");
})

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {

    console.log("Cliente conectado!");

    const managerProducts = new ProductManager();
    try {
      const products = await managerProducts.getProducts();
      socket.emit("products", products.docs);
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
          socketServer.emit("chats", chats);
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

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/chat", chatsRouter);
app.use("/api/sessions", sessionsRouter);

app.use(errorHandler);