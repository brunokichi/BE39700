import fs from "fs";
import __dirname from "../../utils.js";

class CartManager {
  #path;

  constructor() {
    this.#path = __dirname + "/dao/file-managers/files/cart.json";
  }

  async getCarts() {
    try {
      const carts = await fs.promises.readFile(this.#path, "utf-8");
      return JSON.parse(carts);
    } catch (e) {
      return [];
    }
  }

  async getCartById(idCart) {
    try {
      const carts = await this.getCarts();
      const cart = carts.filter((el) => el.id === +idCart);

      if (cart.length > 0) {
        return cart[0].products;
      } else {
        return `El carrito con ID ${idCart} es inexistente`;
      }
    } catch (e) {
      return e;
    }
  }

  async addCart() {
      const products = [];
      try {
        const carts = await this.getCarts();
        
        let maxId = carts.length;

        if (carts.length > 0) {
          maxId = Math.max(...carts.map((o) => o.id)) + 1;
        }
        const newCart = {
          id: maxId,
          products,
        };

        const updatedCarts = [...carts, newCart];

        try {
          await fs.promises.writeFile(this.#path, JSON.stringify(updatedCarts));
          return `Carrito generado con ID ${maxId}`;
        } catch (e) {
          return e;
        }
    } catch (e) {
      return e;
    }

  }

  async addProductToCart(cid, pid) {
    try {
      const carts = await this.getCarts();

      const cart = carts.filter((el) => el.id === +cid);
      const cartIndex = carts.findIndex((el) => el.id === +cid);

      if (cart.length > 0) {
        const { products } = cart[0];

        const product = products.filter((el) => el.product === pid);
        

        if (product.length > 0) {
          const productIndex = products.findIndex((el) => el.product === pid);
          const quantity = product[0].quantity + 1;
          products[productIndex] = { ...products[productIndex], quantity };
        } else {
          const newProduct = {
            product: pid,
            quantity: 1,
          };
          products.push(newProduct);
        }
        carts[cartIndex] = { ...carts[cartIndex], products };
        try {
          await fs.promises.writeFile(this.#path, JSON.stringify(carts));
          return "Producto cargado";
        } catch (e) {
          return e;
        }
      } else {
        return `Error! el carrito con ID ${cid} no existe`;
      }
    } catch (e) {
      return e;
    }
  }
}

export default CartManager;
