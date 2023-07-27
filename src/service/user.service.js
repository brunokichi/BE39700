import { UserManager } from "../dao/index.js";

const manager = new UserManager();

class UserService{
    static changeRol = (userId)=>{
        const updRol =  manager.changeRol(userId);
        return updRol;
    }

    static deleteUserById = (userId)=>{
        const deleteUserById =  manager.deleteUserById(userId);
        return deleteUserById;
    }

    static deleteUsersIdle = ()=>{
        const deleteUsersIdle =  manager.deleteUsersIdle();
        return deleteUsersIdle;
    }

    static getUsers = async ()=> {
        const resUsers =  await manager.getUsers();
        return resUsers;
    };

    static uploadAvatar = (userId, fileName)=>{
        const uploadAvatar =  manager.uploadAvatar(userId, fileName);
        return uploadAvatar;
    }

    static uploadDoc = (userId, files)=>{
        const uploadDoc =  manager.uploadDoc(userId, files);
        return uploadDoc;
    }
}

export { UserService }