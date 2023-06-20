import { UserManager } from "../dao/index.js";

const manager = new UserManager();

class UserService{
    static changeRol = (userId)=>{
        const updRol =  manager.changeRol(userId);
        return updRol;
    }
}

export { UserService }