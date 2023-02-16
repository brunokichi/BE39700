//const fs = require("fs");
import fs from "fs";

class ProductManager {
  #path;

  constructor() {
    this.#path = "./src/Productos.json";
  }

  async getProducts() {
    try {
      const products = await fs.promises.readFile(this.#path, "utf-8");

      return JSON.parse(products);
    } catch (e) {
      return [{ nombre: "no trae datos" }];
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    const products = await this.getProducts();

    const searchCode = products.find((pro) => pro.code === code);

    if (searchCode) {
      console.log(
        `Error! el producto con código ${code} ya se encontraba cargado`
      );
    } else {
      let maxId = products.length;
      if (products.length > 0) {
        maxId = Math.max(...products.map((o) => o.id)) + 1;
      }
      console.log(maxId);
      const newProduct = {
        id: maxId,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      const updatedProducts = [...products, newProduct];

      await fs.promises.writeFile(this.#path, JSON.stringify(updatedProducts));
    }
  }

  async getProductsById(idProduct) {
    const products = await this.getProducts();

    const product = products.filter((el) => el.id === idProduct);

    if (product.length > 0) {
      return product;
    } else {
      console.log(`El producto con ID ${idProduct} es inexistente`);
      return `
        <html>
          <body>
            <p>El producto con ID ${idProduct} es inexistente</p>
          </body>
        </html>
        `;
    }
  }

  async updateProduct(
    idProduct,
    title,
    description,
    price,
    thumbnail,
    code,
    stock
  ) {
    const products = await this.getProducts();

    const product = products.filter((el) => el.id === idProduct);
    const index = products.findIndex((el) => el.id === idProduct);

    if (product.length > 0) {
      if (title) {
        products[index] = { ...products[index], title };
      }
      if (description) {
        products[index] = { ...products[index], description };
      }
      if (price) {
        products[index] = { ...products[index], price };
      }
      if (thumbnail) {
        products[index] = { ...products[index], thumbnail };
      }
      if (code) {
        products[index] = { ...products[index], code };
      }
      if (stock) {
        products[index] = { ...products[index], stock };
      }
      await fs.promises.writeFile(this.#path, JSON.stringify(products));

      console.log(`Producto ID ${idProduct} modificado`);
    } else {
      throw new Error(`El producto con ID ${idProduct} es inexistente`);
    }
  }

  async deleteProduct(idProduct) {
    const products = await this.getProducts();

    const product = products.filter((el) => el.id === idProduct);

    if (product.length > 0) {
      const index = products.findIndex((el) => el.id === idProduct);
      products.splice(index, 1);

      await fs.promises.writeFile(this.#path, JSON.stringify(products));
      console.log(`Producto ID ${idProduct} eliminado`);
    } else {
      console.log(`Error! el producto con ID ${idProduct} es inexistente`);
    }
  }
}

//async function main() {

/*const manager = new ProductManager('./Productos.json');
  
  console.log(await manager.getProducts());
  await manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
  await manager.addProduct("titulo 1", "descripcion 1", 35, "miniatura1.png", 8877, 15);
  console.log(await manager.getProducts());
  console.log(await manager.getProductsById(0));
  await manager.updateProduct(0, "", "modifico descripcion", 210, "Con imagen", 8877, 35);
  console.log(await manager.getProducts());
  await manager.deleteProduct(0);
  console.log(await manager.getProducts());*/
//}

//main();

export default ProductManager;
