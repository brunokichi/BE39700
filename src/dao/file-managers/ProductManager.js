import fs from "fs";
import __dirname from "../../utils.js";

class ProductManager {
  #path;

  constructor() {
    this.#path = __dirname + "/dao/file-managers/files/products.json";
  }

  async getProducts() {
    try {
      const products = await fs.promises.readFile(this.#path, "utf-8");
      return JSON.parse(products);
    } catch (e) {
      return [{ nombre: "no trae datos" }];
    }
  }

  async addProduct(
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnail
  ) {
    if (!title || !description || !code || !price || !stock || !category) {
      return "Error! Algún campo está incompleto";
    } else if ( typeof price != 'number') {
      return "Error! El valor del campo precio no es válido";
    } else if ( typeof stock != 'number') {
      return "Error! El valor del campo stock no es válido";
    } else {
      try { 
        const products = await this.getProducts();

        const searchCode = products.find((pro) => pro.code === code);

        if (searchCode) {
          return  `Error! el producto con código ${code} ya se encontraba cargado`;
        } else {
          let maxId = products.length;
          if (products.length > 0) {
            maxId = Math.max(...products.map((o) => o.id)) + 1;
          }
          const newProduct = {
            id: maxId,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail,
          };

          const updatedProducts = [...products, newProduct];

          try {
            await fs.promises.writeFile(
              this.#path,
              JSON.stringify(updatedProducts)
            );
            return "Producto cargado";
          } catch (e) {
            return e;
          }
        }
      } catch (e) {
        return e;
      }
    }
  }

  async getProductsById(idProduct) {
    try {
      const products = await this.getProducts();

      const product = products.filter((el) => el.id === +idProduct);

      if (product.length > 0) {
        return product;
      } else {
        return `
          <html>
            <body>
              <p>El producto con ID ${idProduct} es inexistente</p>
            </body>
          </html>
          `;
      }
    } catch (e) {
      return e;
    }
  }

  async updateProduct(id, updateProductData) {
    try { 
      const products = await this.getProducts();
      const { title, description, code, price, status, stock, category, thumbnail } = updateProductData;

      const product = products.filter((el) => el.id === +id);
      
      if (product.length > 0) {
        const index = products.findIndex((el) => el.id === +id);
        console.log(title);
        if (title) {
          products[index] = { ...products[index], title };
        }
        if (description) {
          products[index] = { ...products[index], description };
        }
        if (code) {
          products[index] = { ...products[index], code };
        }
        if (price) {
          products[index] = { ...products[index], price };
        }
        if (status) {
          products[index] = { ...products[index], status };
        }
        if (stock) {
          products[index] = { ...products[index], stock };
        }
        if (category) {
          products[index] = { ...products[index], category };
        }
        if (thumbnail) {
          products[index] = { ...products[index], thumbnail };
        }

        try {
          await fs.promises.writeFile(
            this.#path,
            JSON.stringify(products)
          );
          return `Producto ID ${id} modificado`;
        } catch (e) {
          console.log("no encuentra");
          return e;
        }


      } else {
        return `El producto con ID ${id} es inexistente`;
      }
    } catch (e) {
      return e;
    }
  }

  async deleteProduct(idProduct) {
    try {
      const products = await this.getProducts();

      const product = products.filter((el) => el.id === +idProduct);

      if (product.length > 0) {
        const index = products.findIndex((el) => el.id === idProduct);
        products.splice(index, 1);

        try {
          await fs.promises.writeFile(
            this.#path,
            JSON.stringify(products)
          );
          return `Producto ID ${idProduct} eliminado`;
        } catch (e) {
          return e;
        }

      } else {
        return `Error! el producto con ID ${idProduct} es inexistente`;
      }
    } catch (e) {
      return e;
    }
  }
  
}

export default ProductManager;
