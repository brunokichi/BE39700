import fs from "fs";

class ProductManager {
  #path;

  constructor() {
    this.#path = "./src/products.json";
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
    } else {
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
    }
  }

  async getProductsById(idProduct) {
    const products = await this.getProducts();

    const product = products.filter((el) => el.id === idProduct);

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
  }

  async updateProduct(
    idProduct,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail
  ) {
    const products = await this.getProducts();

    const product = products.filter((el) => el.id === idProduct);

    if (product.length > 0) {
      const index = products.findIndex((el) => el.id === idProduct);
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

      await fs.promises.writeFile(this.#path, JSON.stringify(products));

      return `Producto ID ${idProduct} modificado`;
    } else {
      return `El producto con ID ${idProduct} es inexistente`;
    }
  }

  async deleteProduct(idProduct) {
    const products = await this.getProducts();

    const product = products.filter((el) => el.id === idProduct);

    if (product.length > 0) {
      const index = products.findIndex((el) => el.id === idProduct);
      products.splice(index, 1);

      await fs.promises.writeFile(this.#path, JSON.stringify(products));
      return `Producto ID ${idProduct} eliminado`;
    } else {
      return `Error! el producto con ID ${idProduct} es inexistente`;
    }
  }
}

export default ProductManager;
