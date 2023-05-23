import { CartService } from "../service/cart.service.js";

class CartController{
    static getCarts = async (req,res)=>{
        try {
            const carts = await CartService.getCarts();
            res.json(carts);
        } catch (e) {
            return e;
          }
    };

    static getCartById = async (req,res)=>{
        try {
            const cart = await CartService.getCartById(req.params.cid);
            res.json(cart);
        } catch (e) {
            return e;
        }
    };

    static addCart = async (req,res)=>{
        try {
            const newCart = await CartService.addCart();
            return newCart;
            //res.send(newCart);
        } catch (e) {
            return e;
        }
    };

    static addProductToCart = async (req,res)=>{
        try {
            const product = await CartService.addProductToCart(req.params.cid, req.params.pid);
            res.send(product);
        } catch (e) {
            return e;
        }
    };

    static putProductsToCart = async (req,res)=>{
        const products = req.body;
        try {
            const cart = await CartService.putProductsToCart(req.params.cid, products);
            res.json(cart);
        } catch (e) {
            return e;
        }
    };

    static updProductFromCart = async (req,res)=>{
        const { quantity } = req.body;
        try {
            const cart = await CartService.updProductFromCart(req.params.cid, req.params.pid, quantity);
            res.json(cart);
        } catch (e) {
            return e;
        }
    };

    static deleteProductFromCart = async (req,res)=>{
        try {
            const delProduct = await CartService.deleteProductFromCart(req.params.cid, req.params.pid);
            res.json(delProduct);
        } catch (e) {
            return "Se produjo un error al eliminar el producto del carrito";
        }
    };

    static emptyCart = async (req,res)=>{
        try {
            const delProducts = await CartService.emptyCart(req.params.cid);
            res.json(delProducts);
        } catch (e) {
            return "Se produjo un error al vaciar el carrito";
        }
    };

    static purchase = async (req,res)=>{
        try {
            const newPurchase = await CartService.purchase(req.params.cid, req.user);
            //return newPurchase;
            res.send(newPurchase);
        } catch (e) {
            return e;
        }
    };
}

export { CartController }
