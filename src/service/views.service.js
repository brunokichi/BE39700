import { ProductManager, CartManager, SessionManager, UserManager, TicketManager } from "../dao/index.js"

const managerCarts = new CartManager();
const managerProducts = new ProductManager();
const managerSessions = new SessionManager();
const managerUsers = new UserManager();
const managerTickets = new TicketManager();

class ViewsService{
    static profileUser = async (id)=> {
        const resProfileUser =  await managerSessions.profileUser(id);
        return resProfileUser;
    };

    static logoutUser = async (id)=> {
        const resLogoutUser =  await managerSessions.logoutUser(id);
        return resLogoutUser;
    };

    static getProducts = async (limit, page, sort, title, stock)=> {
        const resProducts =  await managerProducts.getProducts(limit, page, sort, title, stock);
        return resProducts;
    };

    static adminUsers = async ()=> {
        const resUsers =  await managerUsers.getUsers();
        return resUsers;
    };

    static getCartById = async (cid)=> {
        const cart =  await managerCarts.getCartById(cid);
        return cart;
    };

    static getTicketById = async (tid)=> {
        const ticket =  await managerTickets.getTicketById(tid);
        return ticket;
    };

    static mockingproducts = ()=> {
        const resMockingProducts =  managerProducts.getMockingProducts();
        return resMockingProducts;
    };

    static loggerTest = ()=> {
        const resLoggerTest =  managerSessions.getLoggerTest();
        return resLoggerTest;
    };
}

export { ViewsService }