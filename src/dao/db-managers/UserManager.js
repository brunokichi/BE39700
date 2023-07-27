import userModel from "../models/UserModel.js";

import { CustomError } from "../../service/errors/error.service.js";
import { EError, MError } from "../../service/errors/enums.js";
import { generateErrorDB } from "../../service/errors/errorDatabase.js";
import { generateErrorSys } from "../../service/errors/errorSys.js";

import { addLogger } from "../../utils/logger.js";
import { sendDeleteUser } from "../../utils/email.js";
import { log } from "console";
const logger = addLogger();

export default class UserManager {
    changeRol = async (userId) => {
        
        try {
            const user = await userModel.findById(userId);
            let newRol = "";
            if(user.rol === "Usuario"){
                if(user.documents.length === 3 && user.status == "Completo"){
                    newRol = "Premium";
                } else {
                    CustomError.createError({
                        name:"Documentacion de usuario incompleta",
                        cause:generateErrorSys(MError.US05),
                        message: MError.US05,
                        errorCode: EError.AUTH_ERROR
                      });
                      logger.debug(`${MError.US05} - ${new Date().toLocaleTimeString()}`);
                      return "US05";
                }
            } else if (user.rol === "Premium"){
                newRol = "Usuario";
            } else {
                CustomError.createError({
                    name:"Perfil de usuario incorrecto / inexistente",
                    cause:generateErrorSys(MError.US04),
                    message: MError.US04,
                    errorCode: EError.AUTH_ERROR
                  });
                  logger.debug(`${MError.US04} - ${new Date().toLocaleTimeString()}`);
                  return "US04";
            }
            const result = await userModel.updateOne({ _id: userId }  ,  { rol: newRol} );
            return newRol;
        } catch (error) {
            CustomError.createError({
                name:"DB Error en busqueda de usuario",
                cause:generateErrorDB(MError.DB03),
                message: MError.DB03,
                errorCode: EError.DB_ERROR
              });
              logger.error(`${EError.DB_ERROR} - ${error.message} - ${new Date().toLocaleTimeString()}`);
              return "DB03";
        }
    }

    deleteUserById = async (userId) => {
        try {
            const user = await userModel.findById(userId);
            if(user){
                const result = await userModel.findOneAndDelete({ _id: user._id });
                const send = await sendDeleteUser(user.email, user.first_name, user.last_name);
                return "DE01";
            } else {
                CustomError.createError({
                    name:"Perfil de usuario incorrecto / inexistente",
                    cause:generateErrorSys(MError.US04),
                    message: MError.US04,
                    errorCode: EError.AUTH_ERROR
                  });
                  logger.debug(`${MError.US04} - ${new Date().toLocaleTimeString()}`);
                  return "US04";
              }
        } catch (error) {
            CustomError.createError({
                name:"DB Error en busqueda de usuario",
                cause:generateErrorDB(MError.DB03),
                message: MError.DB03,
                errorCode: EError.DB_ERROR
              });
              logger.error(`${EError.DB_ERROR} - ${error.message} - ${new Date().toLocaleTimeString()}`);
              return "DB03";
        }
    }

    deleteUsersIdle = async () => {
        try {
            const fecha = new Date(new Date().getTime()-(2*24*60*60*1000));
            //const fecha = new Date(new Date().getTime()-(30*60*1000));
            const users = await userModel.find({ last_connection: {$lte: fecha}, rol: {$ne: "Admin"}});
            if(users.length>0){
                try {
                    const result = await userModel.deleteMany({ last_connection: {$lte: fecha}, rol: {$ne: "Admin"}});
                    users.forEach(async user => {
                        const send = await sendDeleteUser(user.email, user.first_name, user.last_name);
                    });
                    return "DE02";
                } catch (error) {
                        CustomError.createError({
                            name:"DB Error en eliminacion de usuarios inactivos",
                            cause:generateErrorDB(MError.DB03),
                            message: MError.DB03,
                            errorCode: EError.DB_ERROR
                          });
                          logger.error(`${EError.DB_ERROR} - ${error.message} - ${new Date().toLocaleTimeString()}`);
                          return "DB03";
                    }
            } else {
                  return "DE03";
              }
        } catch (error) {
            CustomError.createError({
                name:"DB Error en busqueda de usuario",
                cause:generateErrorDB(MError.DB03),
                message: MError.DB03,
                errorCode: EError.DB_ERROR
              });
              logger.error(`${EError.DB_ERROR} - ${error.message} - ${new Date().toLocaleTimeString()}`);
              return "DB03";
        }
    }

    getUsers = async () => {
        try {
          const users = await userModel.find({ rol: { $in: ['Usuario', 'Premium'] }}).lean();
          return users;
        } catch (e) {
          //return e.message;
          CustomError.createError({
            name:"DB Error en busqueda de usuarios",
            cause:generateErrorDB(MError.DB03),
            message: MError.DB03,
            errorCode: EError.DB_ERROR
          });
          logger.error(`${MError.DB03} - ${new Date().toLocaleTimeString()}`);
          return "DB Error en busqueda de usuarios";
        }
      }; 

    uploadAvatar = async (userId, fileName) => {
        try { 
            const result = await userModel.updateOne({ _id: userId }  ,  { avatar: fileName} );
            return "OK99";
        } catch (error) {
            CustomError.createError({
                name:"DB Error en actualizacion de avatar",
                cause:generateErrorDB(MError.DB03),
                message: MError.DB03,
                errorCode: EError.DB_ERROR
              });
              logger.error(`${EError.DB_ERROR} - ${error.message} - ${new Date().toLocaleTimeString()}`);
              return "DB03";
        }
    }

    uploadDoc = async (userId, files) => {
        try { 
            const user = await userModel.findById(userId);
            if(user){
                const identification = files['identification']?.[0] || null;
                const address = files['address']?.[0] || null;
                const account = files['account']?.[0] || null;
                const docs = [];
                if(identification){
                    docs.push({name:"identification", reference: identification.filename});
                }
                if(address){
                    docs.push({name:"address", reference: address.filename});
                }
                if(account){
                    docs.push({name:"account", reference: account.filename});
                }
                if(docs.length === 3){
                    user.status = "Completo";
                } else {
                    user.status = "Incompleto";
                }
                user.documents = docs;
                const userUpdated = await userModel.findByIdAndUpdate(userId, user );
                return "OK99";
            }

        } catch (error) {
            CustomError.createError({
                name:"DB Error en actualizacion de documentos",
                cause:generateErrorDB(MError.DB03),
                message: MError.DB03,
                errorCode: EError.DB_ERROR
              });
              logger.error(`${EError.DB_ERROR} - ${error.message} - ${new Date().toLocaleTimeString()}`);
              return "DB03";
        }
    }
}