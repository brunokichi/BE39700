import cartModel from "../models/CartModel.js";

export default class CartManager {
  getCarts = async () => {
    try {
      const carts = await cartModel.find().lean();
      return carts;
    } catch (e) {
      return "Se produjo un error al buscar los carritos";
    }
  };

  getCartById = async (idCart) => {
    try {
      const cart = await cartModel.findById(idCart);
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
      return "Carrito no encontrado";
    }
  };

}
