import productModel from "../models/ProductModel.js";
import { generateProduct } from "../../utils.js";

import { CustomError } from "../../service/errors/error.service.js";
import { EError, MError } from "../../service/errors/enums.js";
import { generateErrorDB } from "../../service/errors/errorDatabase.js";
import { generateErrorProduct } from "../../service/errors/errorProduct.js";

import { sendDeleteProduct } from "../../utils/email.js";

import { addLogger } from "../../utils/logger.js";
import userModel from "../models/UserModel.js";
const logger = addLogger();
export default class ProductManager {

  getProducts = async (limit, page, sort, title, stock) => {
    let order = '';
    if (sort) {
      order = {price: `${sort}`};
    }

    let query = {};
    if (title) {
      query.title = title;
    }
    if (stock) {
      query.stock = +stock;
    }
    
    try {
      const products = await productModel.paginate(
        query,
        {
          limit: limit ?? 10,
          lean: true,
          page: page ?? 1,
          sort: order,
        })
      return products;
      } catch (e) {
        //return e.message;
        CustomError.createError({
          name:"DB Error en busqueda de productos",
          cause:generateErrorDB(MError.DB04),
          message: MError.DB04,
          errorCode: EError.DB_ERROR
        });
        logger.error(`${MError.DB04} - ${new Date().toLocaleTimeString()}`);
        return "DB Error en busqueda de productos";
      }
  };
  
  getProductsById = async (productId) => {
    try {
      const product = await productModel.findById(productId);
      return product;
    } catch (e) {
      //return e.message;
      CustomError.createError({
        name:"DB Error en busqueda de producto mediante ID",
        cause:generateErrorDB(MError.DB04),
        message: MError.DB04,
        errorCode: EError.DB_ERROR
      });
      logger.error(`${MError.DB04} - ${new Date().toLocaleTimeString()}`);
      return "DB Error en busqueda de producto mediante ID";
    }
  }; 
  
  addProduct = async (
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail, 
    image,
    owner
  ) => {
    
    if (!title || !description || !code || !price || !stock || !category) {
      //return "Error! Algún campo está incompleto";
      CustomError.createError({
        name:"Error en creacion de producto",
        cause:generateErrorProduct('completo', MError.PR01, title, description, code, price, stock, category),
        message: MError.PR01,
        errorCode: EError.PRODUCT_ERROR
      });
      logger.debug(`${MError.PR01} - ${new Date().toLocaleTimeString()}`);
      return "Error en creacion de producto";
    } else if (typeof price != "number") {
      //return "Error! El valor del campo precio no es válido";
      CustomError.createError({
        name:"Error en creacion de producto",
        cause:generateErrorProduct('completo', MError.PR01, title, description, code, price, stock, category),
        message: MError.PR01,
        errorCode: EError.PRODUCT_ERROR
      });
      logger.debug(`${MError.PR01} - ${new Date().toLocaleTimeString()}`);
      return "Error en creacion de producto";
    } else if (typeof stock != "number") {
      //return "Error! El valor del campo stock no es válido";
      CustomError.createError({
        name:"Error en creacion de producto",
        cause:generateErrorProduct('completo', MError.PR01, title, description, code, price, stock, category),
        message: MError.PR01,
        errorCode: EError.PRODUCT_ERROR
      });
      logger.debug(`${MError.PR01} - ${new Date().toLocaleTimeString()}`);
      return "Error en creacion de producto";
    } else {

      try {
        const product = await productModel.findOne({ code: code });
        if (product) {
          //return `Error! el producto con código ${code} ya se encontraba cargado`;
          CustomError.createError({
            name:"Error en creacion de producto",
            cause:generateErrorProduct('completo', MError.PR02, title, description, code, price, stock, category),
            message: MError.PR02,
            errorCode: EError.PRODUCT_ERROR
          });
          logger.debug(`${MError.PR02} - Código ${code} - ${new Date().toLocaleTimeString()}`);
          return "Error en creacion de producto";
        } else {
          try {
            const newProduct = await productModel.create({
              title,
              description,
              code,
              price,
              status,
              stock,
              category,
              thumbnail,
              image, 
              owner
            });
            return "Producto cargado";
          } catch (e) {
            //return "Se produjo un error al cargar el producto";
            //return e;
            CustomError.createError({
              name:"DB Error en carga de producto",
              cause:generateErrorDB(MError.DB05),
              message: MError.DB05,
              errorCode: EError.DB_ERROR
            });
            logger.error(`${MError.DB05} - ${new Date().toLocaleTimeString()}`);
            return "DB Error en carga de producto";
          }
        }
      } catch (e) {
        //return "Se produjo un error al validar la existencia del código de producto";
        CustomError.createError({
          name:"DB Error al validar la existencia del código de producto en carga",
          cause:generateErrorDB(MError.DB05),
          message: MError.DB05,
          errorCode: EError.DB_ERROR
        });
        logger.error(`${MError.DB05} - ${new Date().toLocaleTimeString()}`);
        return "DB Error al validar la existencia del código de producto en carga";
      }
    }
  };
  
  updateProduct = async (productId, updateProductData) => {
    try {
      const result = await productModel.updateOne({ _id: productId} ,  updateProductData);
      return result;
    } catch (e) {
      //return e.message;
      CustomError.createError({
        name:"DB Error al actualizar un producto",
        cause:generateErrorDB(MError.DB05),
        message: MError.DB06,
        errorCode: EError.DB_ERROR
      });
      logger.error(`${MError.DB06} - ${new Date().toLocaleTimeString()}`);
      return "DB Error al actualizar un producto";
    }
  };
  
  deleteProduct = async (productId, userId, userRol) => {
    try {
      const product = await productModel.findById(productId);
      if(product){
        if (userRol === "Admin" || ( userRol === "Premium" && userId == product.owner )) {
          try {
            const result = await productModel.deleteOne({ _id: productId });
            const userOwner = await userModel.findById(product.owner);
            if (userOwner.rol === "Premium") {
              const send = await sendDeleteProduct(userOwner.email, userOwner.first_name, userOwner.last_name, productId);
            }
            return `Producto ID ${productId} eliminado`;
          } catch (error) {
            CustomError.createError({
              name:"DB Error al eliminar un producto",
              cause:generateErrorDB(MError.DB06),
              message: MError.DB06,
              errorCode: EError.DB_ERROR
            });
            logger.error(`${MError.DB06} - ${error.message} - ${new Date().toLocaleTimeString()}`);
            return "DB Error al eliminar un producto";
          }
        } else {
          CustomError.createError({
            name:"Perfil de usuario inadecuado",
            cause:generateErrorSys(MError.US04),
            message: MError.US04,
            errorCode: EError.AUTH_ERROR
          });
          logger.debug(`${MError.US04} - ${new Date().toLocaleTimeString()}`);
          return "Perfil de usuario inadecuado";
        }
      } else {
        CustomError.createError({
          name:"Error! ID producto inexistente",
          cause:generateErrorProduct('simple', MError.PR04, '', '', '' , '', '', '', productId),
          message: MError.PR04,
          errorCode: EError.PRODUCT_ERROR
        });
        logger.debug(`${MError.PR04} - ${productId} - ${new Date().toLocaleTimeString()}`);
        return "Error! ID producto inexistente";
      }
    } catch (e) {
      //return e.message;
      CustomError.createError({
        name:"DB Error al eliminar un producto",
        cause:generateErrorDB(MError.DB06),
        message: MError.DB06,
        errorCode: EError.DB_ERROR
      });
      logger.error(`${MError.DB06} - ${e.message} - ${new Date().toLocaleTimeString()}`);
      return "DB Error al eliminar un producto";
    }
  };

  getMockingProducts = () => {
    let products = [];
    for(let i=0;i<=100;i++){
        const product = generateProduct();
        products.push(product);
    }
    return products;
  }; 
}
