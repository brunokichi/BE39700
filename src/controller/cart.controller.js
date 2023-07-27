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
            const { section } = req.body;
            const userId = JSON.parse(JSON.stringify(req.user._id));
            const product = await CartService.addProductToCart(req.params.cid, req.params.pid, userId);
            //res.send(product);
            if (section) {
                res.redirect('/cart?result=' + product);
            } else {
                res.redirect('/products?result=' + product);
            }
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
        const { quantity, section } = req.body;
        try {
            const cart = await CartService.updProductFromCart(req.params.cid, req.params.pid, quantity);
            if (section) {
                res.redirect('/cart?result=' + cart);
            } else {
                res.json(cart);
            }
        } catch (e) {
            return e;
        }
    };

    static deleteProductFromCart = async (req,res)=>{
        try {
            const { section } = req.body;
            const delProduct = await CartService.deleteProductFromCart(req.params.cid, req.params.pid);
            if (section) {
                res.redirect('/cart?result=' + delProduct);
            } else {
                res.json(delProduct);
            }
        } catch (e) {
            return "Se produjo un error al eliminar el producto del carrito";
        }
    };

    static emptyCart = async (req,res)=>{
        try {
            const { section } = req.body;
            const delProducts = await CartService.emptyCart(req.params.cid);
            if (section) {
                res.redirect('/cart?result=' + delProducts);
            } else {
                res.json(delProducts);
            }
        } catch (e) {
            return "Se produjo un error al vaciar el carrito";
        }
    };

    static purchase = async (req,res)=>{
        try {
            const newPurchase = await CartService.purchase(req.params.cid, req.user);
            if (newPurchase.length === 4){
                res.redirect('/purchase?result=' + newPurchase);
            } else {
                res.redirect('/purchase?tid=' + newPurchase);
            }
        } catch (e) {
            return e;
        }
    };
}

export { CartController }
