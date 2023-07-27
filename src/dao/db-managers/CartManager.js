import cartModel from "../models/CartModel.js";
import productModel from "../models/ProductModel.js";
import { TicketManager, ProductManager } from "../index.js";

import { CustomError } from "../../service/errors/error.service.js";
import { EError, MError } from "../../service/errors/enums.js";
import { generateErrorDB } from "../../service/errors/errorDatabase.js";
import { generateErrorProduct } from "../../service/errors/errorProduct.js";
import { generateErrorSys } from "../../service/errors/errorSys.js";

import { addLogger } from "../../utils/logger.js";
const logger = addLogger();

import { sendTicket } from "../../utils/email.js";

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
      return "DB07";
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
      return "DB07";
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
      return "DB08";
      
    }
  };

  addProductToCart = async (cid, pid, userId) => {
    try {
      const cart = await cartModel.findById(cid).populate("products.product");

      try {
        const productAvail = await productModel.findById(pid);
        if (userId == productAvail.owner) {
          CustomError.createError({
            name:"Producto no habilitado para el usuario",
            cause:generateErrorSys(MError.AUTH05),
            message: MError.AUTH05,
            errorCode: EError.AUTH_ERROR
          });
          logger.debug(`${MError.AUTH05} - ${new Date().toLocaleTimeString()}`);
          return "AUTH05";
        } else if (productAvail.stock === 0) {
            // Stock insuficiente
            return "PR05";
        } else {
          const product = cart.products.filter((el) => el.product.id == pid);
          if (product.length > 0) {
            const productIndex = cart.products.findIndex((el) => el.product.id == pid);
            if (cart.products[productIndex].quantity < productAvail.stock) {
                cart.products[productIndex].quantity++;
                cart.save();
                return "OK99";
            } else {
                // Stock insuficiente
                return "PR05";
            }
          } else {
              cart.products.push({ product: pid, quantity: 1 });
              cart.save();
              return "OK99";
          }
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
        return "PR04";
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
      return "DB07";
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
      return "DB07";
    }
  };

  updProductFromCart = async (cid, pid, quantity) => {
    try {
      const cart = await cartModel.findById(cid);
      const product = cart.products.filter((el) => el.product._id == pid);
      if (product.length > 0) {
        try {
          const productStock = await productModel.findById(pid);
          if (quantity < productStock.stock) {
            const productIndex = cart.products.findIndex((el) => el.product._id == pid);
            cart.products[productIndex].quantity = quantity;
            cart.save();
            return "OK99";
          } else {
            return "PR05";
          }
        } catch (e) {
          CustomError.createError({
            name:"Error! ID producto inexistente",
            cause:generateErrorProduct('simple', MError.PR04, '', '', '' , '', '', '', pid),
            message: MError.PR04,
            errorCode: EError.PRODUCT_ERROR
          });
          logger.info(`${MError.PR04} - ${pid} -  ${new Date().toLocaleTimeString()}`);
          return "PR04";
        }
      } else {
        //return "Producto no encontrado en el carrito";
        CustomError.createError({
          name:"Error! ID producto inexistente",
          cause:generateErrorProduct('simple', MError.PR04, '', '', '' , '', '', '', pid),
          message: MError.PR04,
          errorCode: EError.PRODUCT_ERROR
        });
        logger.info(`${MError.PR04} - ${new Date().toLocaleTimeString()}`);
        return "PR04";
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
      return "DB07";
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
        //return `Producto ID ${pid} eliminado del carrito`;
        return "OK98";
      } else {
        //return `Producto ID ${pid} no encontrado en el carrito`;
        CustomError.createError({
          name:"Error! ID producto inexistente",
          cause:generateErrorProduct('simple', MError.PR04, '', '', '' , '', '', '', pid),
          message: MError.PR04,
          errorCode: EError.PRODUCT_ERROR
        });
        logger.info(`${MError.PR04} - ${new Date().toLocaleTimeString()}`);
        return "PR04";
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
      return "DB07";
    }
  };

  emptyCart = async (cid) => {
    try {
      const result = await cartModel.updateOne({ _id: cid}, { products: []});
      return "OK97";
    } catch (e) {
      //return "Carrito no encontrado";
      CustomError.createError({
        name:"DB Error en busqueda de carritos",
        cause:generateErrorDB(MError.DB07),
        message: MError.DB07,
        errorCode: EError.DB_ERROR
      });
      logger.error(`${MError.DB07} - ${new Date().toLocaleTimeString()}`);
      return "DB07";
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
                  const send = await sendTicket(ticketProducts, amount, user.email);
                  try {
                      const newCart = await this.putProductsToCart(cid, rejectProducts);
                      return(ticket.code);
                  } catch (e) {
                      CustomError.createError({
                        name:"No se pudo actualizar el carrito",
                        cause:generateErrorDB(MError.DB10),
                        message: MError.DB10,
                        errorCode: EError.DB_ERROR
                      });
                      logger.error(`${MError.DB10} - ${new Date().toLocaleTimeString()}`);
                      return "GEN99";
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
              return "GEN99";
            }
          } else {
            logger.info(`Cart ID ${cid} - Sin stock suficiente para realizar la operación - ${new Date().toLocaleTimeString()}`);
            return "CA03";
          }
        } else {
          return "CA01";
        }
      } else {
        return "CA02";
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
        return "DB07";
    }
  };
}
