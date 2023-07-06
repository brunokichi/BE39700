import chai from "chai";
import supertest from "supertest";

import userModel from "../src/dao/models/UserModel.js";
import ProductModel from "../src/dao/models/ProductModel.js";

import { app } from "../src/app.js";

const expect = chai.expect;
const requester = supertest(app);
const userTest = "user@coder.com";
const premiumTest = "admin@coder.com"

describe("Test de Ecommerce",()=>{

    describe("Test el modulo de sesiones",()=>{
        
        before(async function(){
            await userModel.deleteMany({});
        });
        
        it("Se debe registrar al usuario correctamente",async function(){
            const user = {
                first_name: "bruno",
                last_name: "user",
                email: userTest,
                age: "38",
                password:"1234"
            };

            const resSignup = await requester.post("/api/sessions/register").send(user);
            expect(resSignup.header.location).to.be.equal("/login?result=OK99");
        });

        it("Al volver a registrar al mismo usuario no debe permitirlo",async function(){
            const user = {
                first_name: "bruno",
                last_name: "user",
                email: userTest,
                age: "38",
                password:"1234"
            };

            const resSignup = await requester.post("/api/sessions/register").send(user);
            expect(resSignup.header.location).to.be.equal("/login?result=US02");
        });

        it("Debe loguear al usuario registrado previamente", async function(){
            
            const userLogin={
                user: userTest,
                password: "1234"
            };

            const resLogin = await requester.post("/api/sessions/login").send(userLogin);
            const resCookie = resLogin.headers["set-cookie"][0];
            const dataCookie={
                name: resCookie.split("=")[0],
                value: resCookie.split("=")[1]
            }

            this.cookie = dataCookie;
            expect(this.cookie.name).to.be.equal("coder-cookie");
        });
    
    });

    describe("Test del modulo de productos",()=>{

        it("Se deben obtener todos los productos", async function(){
            const resProducts = await requester.get("/api/products/");
            expect(resProducts._body.status).to.be.equal("success");
        });

        it("Se debe obtener un producto especifico", async function(){
            const resProducts = await requester.get("/api/products/641e11675589368985a6228c");
            expect(resProducts.status).to.be.equal(200);
        });

        it("Registro un usuario, modifico a Premium y cargo un producto", async function(){
            
            before(async function(){
                await userModel.deleteMany({});
            });

            const premium = {
                first_name: "bruno",
                last_name: "admin",
                email: premiumTest,
                age: "38",
                password:"1234",
            };

            const resSignup = await requester.post("/api/sessions/register").send(premium);

            const changeRol = await userModel.findOneAndUpdate({ email: premium.email }, {rol: "Premium"});

            const premiumLogin={
                user: premiumTest,
                password: "1234"
            };

            const resLogin = await requester.post("/api/sessions/login").send(premiumLogin);

            const resCookie = resLogin.headers["set-cookie"][0];
            const dataCookie={
                name: resCookie.split("=")[0],
                value: resCookie.split("=")[1]
            }

            this.cookie = dataCookie;

            const deleteProd = await ProductModel.findOneAndDelete({ code: "prueba" });

            const product = {
                title: "Titulo test",
                description: "Descripcion test",
                price: 333,
                thumbnail: ["auto", "importado"],
                code: "prueba",
                stock: 65,
                category: "autos",
                status: true
            };

            const resAddProduct = await requester.post("/api/products/").set("Cookie",[`${this.cookie.name}=${this.cookie.value}`]).send(product);
            expect(resAddProduct.status).to.be.equal(200);
        });

    });

    describe("Test del modulo del carrito",()=>{
        
        it("Se deben obtener todos los carritos", async function(){
            const resCarts = await requester.get("/api/carts/");
            expect(resCarts.statusCode).to.be.equal(200);
        });

        it("Se debe poder vaciar el contenido de un carrito", async function(){
            const cart = "6490af94d4cfc0a7025b5633";
            const emptyCart = await requester.delete(`/api/carts/${cart}`);
            expect(emptyCart.statusCode).to.be.equal(200);
        });
    });
});