import { SessionManager } from "../dao/index.js";

const manager = new SessionManager();

class SessionService{
    static addUser = (first_name, last_name, email, age, password)=>{
        const resaddUser =  manager.addUser(first_name, last_name, email, age, password);
        return resaddUser;
    }

    static addUserCart = (email,resCart)=>{
        const resUserCart =  manager.addUserCart(email,resCart);
        return resUserCart;
    }
    
    static loginUser = (user, password)=>{
        const resLogin =  manager.loginUser(user, password);
        return resLogin;
    }

    static forgotPassword = (user)=>{
        const resForgot =  manager.forgotPassword(user);
        return resForgot;
    }

    static resetPassword = (token, user, password)=>{
        const resReset =  manager.resetPassword(token, user, password);
        return resReset;
    }
}

export { SessionService }