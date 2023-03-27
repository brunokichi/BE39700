import productModel from "../models/ProductModel.js";

export default class ProductManager {

  getProducts = async () => {
    try {
      const products = await productModel.find().lean();
      return products;
    } catch (e) {
      return e.message;
    }
  };
  
  getProductsById = async (productId) => {
    try {
      const product = await productModel.findById(productId);
      return product;
    } catch (e) {
      return e.message;
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
    thumbnail
  ) => {
    
    if (!title || !description || !code || !price || !stock || !category) {
      return "Error! Algún campo está incompleto";
    } else if (typeof price != "number") {
      return "Error! El valor del campo precio no es válido";
    } else if (typeof stock != "number") {
      return "Error! El valor del campo stock no es válido";
    } else {

      try {
        const product = await productModel.findOne({ code: code });
        if (product) {
          return `Error! el producto con código ${code} ya se encontraba cargado`;
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
            });
            return "Producto cargado";
          } catch (e) {
            return "Se produjo un error al cargar el producto";
          }
        }
      } catch (e) {
        return "Se produjo un error al validar la existencia del código de producto";
      }
    }
  };
  
  updateProduct = async (productId, updateProductData) => {
    try {
      const result = await productModel.updateOne({ _id: productId} ,  updateProductData);
      return result;
    } catch (e) {
      return e.message;
    }
  };
  
  deleteProduct = async (productId) => {
    try {
      const result = await productModel.deleteOne({ _id: productId });
      if(result.deletedCount > 0) {
        return `Producto ID ${productId} eliminado`;
      } else {
        return `Producto ID ${productId} inexistente`;
      }
    } catch (e) {
      return e.message;
    }
  };
}
