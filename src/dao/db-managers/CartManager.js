import cartModel from "../models/CartModel.js";
import productModel from "../models/ProductModel.js";

export default class CartManager {

  getCarts = async () => {
    try {
      const carts = await cartModel
      .find()
      .lean()
      .populate("products.product");
      return carts;
    } catch (e) {
      return "Se produjo un error al buscar los carritos";
    }
  };

  getCartById = async (idCart) => {
    try {
      const cart = await cartModel
      .findById(idCart)
      .populate("products.product");
      return cart;
    } catch (e) {
      return `Carrito ID ${idCart} no encontrado`;
    }
  };

  addCart = async () => {
    try {
      const newCart = await cartModel.create({});
      return `Carrito generado con ID ${newCart._id}`;
    } catch (e) {
      return "Se produjo un error al crear un nuevo carrito";
    }
  };

  addProductToCart = async (cid, pid) => {
    try {
      const cart = await cartModel.findById(cid);

      try {
        await productModel.findById(pid);

        const product = cart.products.filter((el) => el.product === pid);
        if (product.length > 0) {
          const productIndex = cart.products.findIndex((el) => el.product === pid);
          const quantity = product[0].quantity + 1;
          cart.products[productIndex] = {...cart.products[productIndex],quantity};
          return cart.save();
        } else {
          cart.products.push({ product: pid, quantity: 1 });
          return cart.save();
        }
      } catch (e) {
        return "ID de producto inexistente";
      }
    } catch (e) {
      return "Carrito no encontrado";
    }
  };

  putProductsToCart = async (cid, products) => {
    try {
      const result = await cartModel.updateOne({ _id: cid} ,  products);
      return "Carrito actualizado";
    } catch (e) {
      return "Carrito no encontrado";
    }
  };

  updProductFromCart = async (cid, pid, quantity) => {
    try {
      const cart = await cartModel.findById(cid);

      const product = cart.products.filter((el) => el.product === pid);

      if (product.length > 0) {
        const productIndex = cart.products.findIndex((el) => el.product === pid);
        cart.products[productIndex] = {...cart.products[productIndex],quantity};
        return cart.save();
      } else {
        return "Producto no encontrado en el carrito";
      }
    } catch (e) {
      return "Carrito no encontrado";
    }
  };

  deleteProductFromCart = async (cid, pid) => {
    try {
      const cart = await cartModel.findById(cid);
      const product = cart.products.filter((el) => el.product === pid);
      if (product.length > 0) {
        const productIndex = cart.products.findIndex((el) => el.product === pid);
        cart.products.splice(productIndex, 1);
        cart.save();
        return `Producto ID ${pid} eliminado del carrito`;
      } else {
        return `Producto ID ${pid} no encontrado en el carrito`;
      }
    } catch (e) {
      return "Carrito no encontrado";
    }
  };

  emptyCart = async (cid) => {
    try {
      const result = await cartModel.updateOne({ _id: cid}, { products: []});
      return "Carrito vaciado exitosamente";
    } catch (e) {
      return "Carrito no encontrado";
    }
  };
}
