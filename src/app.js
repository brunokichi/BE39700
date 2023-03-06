import express, { urlencoded } from "express";
import handlebars from "express-handlebars";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";

import ProductManager from "./ProductManager.js"

const app = express();
//app.use(json());
app.use(urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname+'/views');
app.set("view engine", "handlebars");
app.use("/", viewsRouter);
app.use(express.static(__dirname + "/../public"));

const httpServer = app.listen(8080, () => {
    console.log("Servidor escuchando en el puerto 8080");
})

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {

    console.log("Cliente conectado!");

    const manager = new ProductManager();

    const products = await manager.getProducts();
    socket.emit("products", products);

})

app.use((req, res, next) => {
    req.socketServer = socketServer;
    next();
})

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);