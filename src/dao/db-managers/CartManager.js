import cartModel from "../models/CartModel.js";
import productModel from "../models/ProductModel.js";
import { TicketManager, ProductManager } from "../index.js";

import { CustomError } from "../../service/errors/error.service.js";
import { EError, MError } from "../../service/errors/enums.js";
import { generateErrorDB } from "../../service/errors/errorDatabase.js";
import { generateErrorProduct } from "../../service/errors/errorProduct.js";

import { addLogger } from "../../utils/logger.js";
const logger = addLogger();

export default class CartManager {

  getCarts = async () => {
    try {
      const carts = await cartModel
      .find()
      .lean()
      .populate("products.product");
      return carts;
    } catch (e) {
      //return "Se produjo un error al buscar los carritos";
      CustomError.createError({
        name:"DB Error en busqueda de carritos",
        cause:generateErrorDB(MError.DB07),
        message: MError.DB07,
        errorCode: EError.DB_ERROR
      });
      logger.erro(`${MError.DB07} - ${new Date().toLocaleTimeString()}`);
      return "Se produjo un error al buscar los carritos";
    }
  };

  getCartById = async (idCart) => {
    try {
      const cart = await cartModel
      .findById(idCart)
      .lean()
      .populate("products.product");
      return cart;
    } catch (e) {
      //return `Carrito ID ${idCart} no encontrado`;
      CustomError.createError({
        name:"DB Error en busqueda de carritos",
        cause:generateErrorDB(MError.DB07),
        message: MError.DB07,
        errorCode: EError.DB_ERROR
      });
      logger.erro(`${MError.DB07} - ${new Date().toLocaleTimeString()}`);
      return "Se produjo un error al buscar el/los carritos";
    }
  };

  addCart = async () => {
    try {
      const newCart = await cartModel.create({});
      return `${newCart._id}`;
    } catch (e) {
      //return "Se produjo un error al crear un nuevo carrito";
      CustomError.createError({
        name:"DB Error en creacion de carrito",
        cause:generateErrorDB(MError.DB08),
        message: MError.DB08,
        errorCode: EError.DB_ERROR
      });
      logger.erro(`${MError.DB08} - ${new Date().toLocaleTimeString()}`);
      return "Se produjo un error al crear el carrito";
      
    }
  };

  addProductToCart = async (cid, pid) => {
    try {
      const cart = await cartModel.findById(cid).populate("products.product");

      try {
        await productModel.findById(pid);

        const product = cart.products.filter((el) => el.product.id == pid);
        if (product.length > 0) {
          const productIndex = cart.products.findIndex((el) => el.product.id == pid);
          cart.products[productIndex].quantity++;
          return cart.save();
        } else {
          cart.products.push({ product: pid, quantity: 1 });
          return cart.save();
        }
      } catch (e) {
        //return "ID de producto inexistente";
        CustomError.createError({
          name:"Error! ID producto inexistente",
          cause:generateErrorProduct('simple', MError.PR04, '', '', '' , '', '', '', pid),
          message: MError.PR04,
          errorCode: EError.PRODUCT_ERROR
        });
        logger.info(`${MError.PR04} - ${pid} -  ${new Date().toLocaleTimeString()}`);
        return "Error! ID producto inexistente";
      }
    } catch (e) {
      //return "Carrito no encontrado";
      CustomError.createError({
        name:"DB Error en busqueda de carritos",
        cause:generateErrorDB(MError.DB07),
        message: MError.DB07,
        errorCode: EError.DB_ERROR
      });
      logger.error(`${MError.DB07} - ${new Date().toLocaleTimeString()}`);
      return "Se produjo un error al buscar el/los carritos";
    }
  };

  putProductsToCart = async (cid, products) => {
    try {
      const result = await cartModel.findByIdAndUpdate(cid, { products: products });
      return "Carrito actualizado";
    } catch (e) {
      //return "ID de carrito inexistente";
      CustomError.createError({
        name:"DB Error en busqueda de carritos",
        cause:generateErrorDB(MError.DB07),
        message: MError.DB07,
        errorCode: EError.DB_ERROR
      });
      logger.error(`${MError.DB07} - ${new Date().toLocaleTimeString()}`);
      return "Se produjo un error al buscar el/los carritos";
    }
  };

  updProductFromCart = async (cid, pid, quantity) => {
    try {
      const cart = await cartModel.findById(cid);

      const product = cart.products.filter((el) => el.product._id == pid);

      if (product.length > 0) {
        const productIndex = cart.products.findIndex((el) => el.product._id == pid);
        cart.products[productIndex].quantity = quantity;
        return cart.save();

      } else {
        //return "Producto no encontrado en el carrito";
        CustomError.createError({
          name:"Error! ID producto inexistente",
          cause:generateErrorProduct('simple', MError.PR04, '', '', '' , '', '', '', pid),
          message: MError.PR04,
          errorCode: EError.PRODUCT_ERROR
        });
        logger.info(`${MError.PR04} - ${new Date().toLocaleTimeString()}`);
        return "Error! ID producto inexistente";
      }
    } catch (e) {
      //return "Carrito no encontrado";
      CustomError.createError({
        name:"DB Error en busqueda de carritos",
        cause:generateErrorDB(MError.DB07),
        message: MError.DB07,
        errorCode: EError.DB_ERROR
      });
      logger.error(`${MError.DB07} - ${new Date().toLocaleTimeString()}`);
      return "Se produjo un error al buscar el/los carritos";
    }
  };

  deleteProductFromCart = async (cid, pid) => {
    try {
      const cart = await cartModel.findById(cid);
      const product = cart.products.filter((el) => el.product._id == pid);
      if (product.length > 0) {
        const productIndex = cart.products.findIndex((el) => el.product._id == pid);
        cart.products.splice(productIndex, 1);
        cart.save();
        return `Producto ID ${pid} eliminado del carrito`;
      } else {
        //return `Producto ID ${pid} no encontrado en el carrito`;
        CustomError.createError({
          name:"Error! ID producto inexistente",
          cause:generateErrorProduct('simple', MError.PR04, '', '', '' , '', '', '', pid),
          message: MError.PR04,
          errorCode: EError.PRODUCT_ERROR
        });
        logger.info(`${MError.PR04} - ${new Date().toLocaleTimeString()}`);
        return "Error! ID producto inexistente";
      }
    } catch (e) {
      //return "Carrito no encontrado";
      CustomError.createError({
        name:"DB Error en busqueda de carritos",
        cause:generateErrorDB(MError.DB07),
        message: MError.DB07,
        errorCode: EError.DB_ERROR
      });
      logger.error(`${MError.DB07} - ${new Date().toLocaleTimeString()}`);
      return "Se produjo un error al buscar el/los carritos";
    }
  };

  emptyCart = async (cid) => {
    try {
      const result = await cartModel.updateOne({ _id: cid}, { products: []});
      return "Carrito vaciado exitosamente";
    } catch (e) {
      //return "Carrito no encontrado";
      CustomError.createError({
        name:"DB Error en busqueda de carritos",
        cause:generateErrorDB(MError.DB07),
        message: MError.DB07,
        errorCode: EError.DB_ERROR
      });
      logger.error(`${MError.DB07} - ${new Date().toLocaleTimeString()}`);
      return "Se produjo un error al buscar el/los carritos";
    }
  };

  purchase = async (cid, user) => {
    
    try {
      const cart = await cartModel.findById(cid);
      let amount = 0;
      if(cart){
        if (cart.products.length > 0) {
          const productManager = new ProductManager();
          const ticketProducts = [];
          const rejectProducts = [];
          for(let i=0; i<cart.products.length;i++){
            const dbProduct = await productModel.findById(cart.products[i].product);
            if(cart.products[i].quantity <= dbProduct.stock) {
              ticketProducts.push(cart.products[i]);
              let newStock = dbProduct.stock - cart.products[i].quantity;
              productManager.updateProduct(cart.products[i].product, {stock: newStock});
              amount += cart.products[i].quantity * dbProduct.price;
            } else {
              rejectProducts.push(cart.products[i]);
            }
          }
          if (ticketProducts.length > 0) {
            const tktManager = new TicketManager();
            try {
                  const ticket = await tktManager.addTicket(ticketProducts, amount, user.email);
                  try {
                      const newCart = await this.putProductsToCart(cid, rejectProducts);
                      return `<b>Ticket generado de la siguiente manera</b> <br/>
                                ${ticket} <br/>
                                <b>Carrito actualizado a</b><br/>
                                ${rejectProducts}
                        `;
                  } catch (e) {
                      return "No se pudo actualizar el carrito";
                  }
            } catch (e) {
              //return "No se pudo generar el ticket";
              CustomError.createError({
                name:"DB Error en generacion de ticket",
                cause:generateErrorDB(MError.DB09),
                message: MError.DB09,
                errorCode: EError.DB_ERROR
              });
              logger.error(`${MError.DB09} - ${new Date().toLocaleTimeString()}`);
              return "Se produjo un error al generar el ticket en CartManager";
            }
          } else {
            logger.info(`Cart ID ${cid} - Sin stock suficiente para realizar la operación - ${new Date().toLocaleTimeString()}`);
            return "No hay stock suficiente para realizar la operación";
          }
        } else {
          res.send("Carrito vacío");
        }
      } else {
        res.send("Carrito inexistente");
      }
    } catch (e) {
        //res.send("Se produjo un error al buscar el carrito");
        CustomError.createError({
          name:"DB Error en busqueda de carritos",
          cause:generateErrorDB(MError.DB07),
          message: MError.DB07,
          errorCode: EError.DB_ERROR
        });
        logger.error(`${MError.DB07} - ${new Date().toLocaleTimeString()}`);
        return "Se produjo un error al buscar el/los carritos";
    }
  };
}
