import { ProductManager, CartManager, SessionManager } from "../dao/index.js"

const managerCarts = new CartManager();
const managerProducts = new ProductManager();
const managerSessions = new SessionManager();

class ViewsService{
    static profileUser = async (id)=> {
        const resProfileUser =  await managerSessions.profileUser(id);
        return resProfileUser;
    };

    static getProducts = async (limit, page, sort, title, stock)=> {
        const resProducts =  await managerProducts.getProducts(limit, page, sort, title, stock);
        return resProducts;
    };

    static getCartById = async (cid)=> {
        const cart =  await managerCarts.getCartById(cid);
        return cart;
    };
}

export { ViewsService }