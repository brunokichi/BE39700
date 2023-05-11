import { SessionManager } from "../dao/index.js";

const manager = new SessionManager();

class SessionService{
    static addUser = (first_name, last_name, email, age, password)=>{
        const resLogin =  manager.addUser(first_name, last_name, email, age, password);
        return resLogin;
    }
    
    static loginUser = (user, password)=>{
        const resLogin =  manager.loginUser(user, password);
        return resLogin;
    }

    
}

export { SessionService }