import { ProductManager } from "../dao/index.js";

const manager = new ProductManager();

class ProductService{
    static getProducts = (limit, page, sort, title, stock)=>{
        const carts =  manager.getProducts(limit, page, sort, title, stock);
        return carts;
    }

    static getProductsById = (pid)=>{
        const product =  manager.getProductsById(pid);
        return product;
    }

    static addProduct = (title, description, code, price, status, stock, category, thumbnail)=>{
        const newProduct =  manager.addProduct(title, description, code, price, status, stock, category, thumbnail);
        return newProduct;
    }

    static updateProduct = (id, updateProductData)=>{
        const updProduct =  manager.updateProduct(id, updateProductData);
        return updProduct;
    }

    static deleteProduct = (pid)=>{
        const delProduct =  manager.deleteProduct(pid);
        return delProduct;
    }
}

export { ProductService }