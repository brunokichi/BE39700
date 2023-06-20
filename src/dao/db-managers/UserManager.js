import userModel from "../models/UserModel.js";

import { CustomError } from "../../service/errors/error.service.js";
import { EError, MError } from "../../service/errors/enums.js";
import { generateErrorDB } from "../../service/errors/errorDatabase.js";

import { addLogger } from "../../utils/logger.js";
const logger = addLogger();

export default class UserManager {
    changeRol = async (userId) => {
        
        try {
            const user = await userModel.findById(userId);
            let newRol = "";
            if(user.rol === "Usuario"){
                newRol = "Premium";
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
        } catch {
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
}