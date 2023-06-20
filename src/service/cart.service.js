import { CartManager } from "../dao/index.js";

const manager = new CartManager();

class CartService{

    static getCarts = ()=>{
        const carts =  manager.getCarts();
        return carts;
    }

    static getCartById = (cid)=>{
        const cart =  manager.getCartById(cid);
        return cart;
    }

    static addCart = ()=>{
        const newCart =  manager.addCart();
        return newCart;
    }

    static addProductToCart = (cid, pid, userId)=>{
        const product =  manager.addProductToCart(cid, pid, userId);
        return product;
    }

    static putProductsToCart = (cid, products)=>{
        const product =  manager.putProductsToCart(cid, products);
        return product;
    }

    static updProductFromCart = (cid, pid, quantity)=>{
        const cart =  manager.updProductFromCart(cid, pid, quantity);
        return cart;
    }

    static deleteProductFromCart = (cid, pid)=>{
        const delProduct =  manager.deleteProductFromCart(cid, pid);
        return delProduct;
    }

    static emptyCart = (cid)=>{
        const delProducts =  manager.emptyCart(cid);
        return delProducts;
    }

    static purchase = (cid, user)=>{
        const newPurchase =  manager.purchase(cid, user);
        return newPurchase;
    }

};

export { CartService }