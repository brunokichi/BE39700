import { createHash, isValidPassword, generateEmailToken, verifyEmailToken} from "../../utils.js";
import userModel from "../models/UserModel.js";
import { sendRecoveryPass } from "../../utils/email.js";

import { config } from "../../config/config.js";
const adminUser = config.admin.user;
const adminSecret = config.admin.secret;

import { CustomError } from "../../service/errors/error.service.js";
import { EError, MError } from "../../service/errors/enums.js";
import { generateErrorAuth } from "../../service/errors/errorAuth.js";
import { generateErrorDB } from "../../service/errors/errorDatabase.js";
import { generateErrorSys } from "../../service/errors/errorSys.js";
import { generateErrorUser } from "../../service/errors/errorUser.js";

import { addLogger } from "../../utils/logger.js";
const logger = addLogger();

export default class SessionManager {
  profileUser = async (id) => {
    try {
      const findUser = await userModel.findOne({ _id: id });
      return findUser;
    } catch (e) {
      //return (e);
      //return "Se produjo un error al buscar el usuario";
      CustomError.createError({
        name:"DB Error en busqueda de usuario",
        cause:generateErrorDB(MError.DB03),
        message: MError.DB03,
        errorCode: EError.DB_ERROR
      });
      logger.error(`${MError.DB03} - ${new Date().toLocaleTimeString()}`);
      return "DB03";
    }
  };

  addUser = async (
    first_name,
    last_name,
    email,
    age,
    password,
    rol
  ) => {
    if (!first_name || !last_name || !email || !age || !password) {
      CustomError.createError({
        name:"Error en creacion de usuario",
        cause:generateErrorUser(first_name, last_name, email, age, password),
        message: MError.US01,
        errorCode: EError.USU_ERROR
      });
      logger.debug(`${MError.US01} - ${new Date().toLocaleTimeString()}`);
      return "US01";
    } else {
      try {
          const validEmail = await userModel.findOne({ email: email });
          if (validEmail) {
            CustomError.createError({
              name:"Error en creacion de usuario",
              cause:generateErrorSys(MError.US02),
              message: MError.US02,
              errorCode: EError.USU_ERROR
            });
            logger.debug(`${MError.US02} - ${email} - ${new Date().toLocaleTimeString()}`);
            return "US02";
          } else {
            try {
              const newUser = await userModel.create({
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                rol,
              });
              return "OK99";
            } catch (e) {
              CustomError.createError({
                name:"DB Error en creacion de usuario",
                cause:generateErrorDB(MError.DB02),
                message: MError.DB02,
                errorCode: EError.DB_ERROR
              });
              logger.error(`${MError.DB02} - ${new Date().toLocaleTimeString()}`);
              return "DB02";
            }
          }
      } catch (e) {
          CustomError.createError({
            name:"DB Error en creacion de usuario",
            cause:generateErrorDB(MError.DB01),
            message: MError.DB01,
            errorCode: EError.DB_ERROR
          });
          logger.error(`${MError.DB01} - ${new Date().toLocaleTimeString()}`);
          return "DB01";
      }
    }
  };

  addUserCart = async (
    email,
    resCart
  ) => {
    try {
      const validEmail = await userModel.findOne({ email: email });
      if (!validEmail || validEmail.rol === "Admin") {
        CustomError.createError({
          name:"SYS Error en perfil de usuario al asignar carrito",
          cause:generateErrorDB(MError.SYS01),
          message: MError.SYS01,
          errorCode: EError.SYS_ERROR
        });
        logger.error(`${MError.SYS01} - ${new Date().toLocaleTimeString()}`);
        return "DB01";
      }
      try {
        const result = await userModel.updateOne({ _id: validEmail._id} ,  {cart: resCart});
        return "OK99";
      } catch (e) {
        CustomError.createError({
          name:"DB Error en asignacion de carrito al crear usuario",
          cause:generateErrorDB(MError.DB02),
          message: MError.DB02,
          errorCode: EError.DB_ERROR
        });
        logger.error(`${MError.DB02} - ${new Date().toLocaleTimeString()}`);
        return "DB02";
      }
    } catch (e) {
      CustomError.createError({
        name:"DB Error en asignacion de carrito al crear usuario",
        cause:generateErrorDB(MError.DB01),
        message: MError.DB01,
        errorCode: EError.DB_ERROR
      });
      logger.error(`${MError.DB01} - ${new Date().toLocaleTimeString()}`);
      return "DB01";
    }
  }

  loginUser = async (user, password) => {
    if (!user || !password) {
      CustomError.createError({
        name:"Error en ingreso de usuario",
        cause:generateErrorAuth(user, password),
        message: MError.US01,
        errorCode: EError.AUTH_ERROR
      });
      logger.debug(`${MError.US01} - ${new Date().toLocaleTimeString()}`);
      return "US01";
    } else {
      if (user === adminUser && password === adminSecret) {
        logger.info(`Atencion! Ingreso de usuario admin - ${new Date().toLocaleTimeString()}`);
        return {
          email: user,
          rol: "Admin",
          _id: "1",
          first_name: "Admin Coder",
        };
      } else {
        try {
          const findUser = await userModel.findOne({ email: user });
          if (findUser && isValidPassword(findUser.password, password)) {
            findUser.last_connection = new Date();
            const userUpdated = await userModel.findByIdAndUpdate(findUser._id, findUser);
            return findUser;
          } else {
            CustomError.createError({
              name:"Error en validacion al ingreso de usuario",
              cause:generateErrorAuth(user, password),
              message: MError.AUTH01,
              errorCode: EError.AUTH_ERROR
            });
            logger.info(`${MError.AUTH01} - ${user} - ${new Date().toLocaleTimeString()}`);
            return "AUTH01";
          }
        } catch (e) {
          CustomError.createError({
            name:"DB Error en busqueda de usuario",
            cause:generateErrorDB(MError.DB03),
            message: MError.DB03,
            errorCode: EError.DB_ERROR
          });
          logger.error(`${EError.DB_ERROR} - ${new Date().toLocaleTimeString()}`);
          return "DB03";
        }
      }
    }
  };

  logoutUser = async (id) => {
    const logoutUser = await userModel.findByIdAndUpdate( id, { last_connection: new Date()});
    return logoutUser;
  }

  getLoggerTest = async () => {
    logger.fatal(`Nivel fatal - ${new Date().toLocaleTimeString()}`);
    logger.error(`Nivel error - ${new Date().toLocaleTimeString()}`);
    logger.warning(`Nivel warning - ${new Date().toLocaleTimeString()}`);
    logger.info(`Nivel info - ${new Date().toLocaleTimeString()}`);
    logger.http(`Nivel http - ${new Date().toLocaleTimeString()}`);
    logger.debug(`Nivel debug - ${new Date().toLocaleTimeString()}`);
  }

  forgotPassword = async (user) => {
    try {
      const findUser = await userModel.findOne({ email: user });
      
      if(!findUser){
          CustomError.createError({
            name:"Error en validacion de usuario",
            cause:generateErrorAuth(user),
            message: MError.AUTH03,
            errorCode: EError.AUTH_ERROR
          });
          logger.info(`${MError.AUTH03} - ${user} - ${new Date().toLocaleTimeString()}`);
          return "AUTH03";
      }

      const token = generateEmailToken(user,3600);
      try {
        const send = await sendRecoveryPass(user, token);
        return ("OK99");
      } catch (error) {
        CustomError.createError({
          name:"Error en envio de email",
          cause:generateErrorAuth(user),
          message: MError.SYS02,
          errorCode: EError.SYS_ERROR
        });
        logger.info(`${MError.SYS02} - ${user} - ${new Date().toLocaleTimeString()}`);
        return "SYS02";
      }
    } catch (error) {
      CustomError.createError({
        name:"Error en búsqueda de usuario",
        cause:generateErrorAuth(user),
        message: MError.DB03,
        errorCode: EError.AUTH_ERROR
      });
      logger.info(`${MError.DB03} - ${user} - ${new Date().toLocaleTimeString()}`);
      return "DB03";
    }
  }

  resetPassword = async (token, user, password) => {
    try {
      const validToken = verifyEmailToken(token);
      if(!validToken){
        CustomError.createError({
          name:"Token vencido / invalido",
          cause:generateErrorSys(MError.AUTH04),
          message: MError.AUTH04,
          errorCode: EError.AUTH_ERROR
        });
        logger.info(`${MError.AUTH04} - ${new Date().toLocaleTimeString()}`);
        return "AUTH04";
      }
      
      if (!user || !password) {
        CustomError.createError({
          name:"Datos incompletos al intentar resetear contraseña",
          cause:generateErrorAuth(user, password),
          message: MError.US01,
          errorCode: EError.AUTH_ERROR
        });
        logger.debug(`${MError.US01} - ${new Date().toLocaleTimeString()}`);
        return "US01";
      } 

      try {
        const findUser = await userModel.findOne({ email: user });
        if(!findUser){
            CustomError.createError({
              name:"Error en validacion de usuario",
              cause:generateErrorAuth(user),
              message: MError.AUTH03,
              errorCode: EError.AUTH_ERROR
            });
            logger.info(`${MError.AUTH03} - ${user} - ${new Date().toLocaleTimeString()}`);
            return "AUTH03";
        }

        if (!isValidPassword(findUser.password, password)) {
          try {
            const result = await userModel.updateOne({ _id: findUser._id }  ,  { password: createHash(password)} );
            return "OK98";
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
        } else {
          CustomError.createError({
            name:"La contraseña ya fue utilizada",
            cause:generateErrorSys(MError.US03),
            message: MError.US03,
            errorCode: EError.AUTH_ERROR
          });
          logger.debug(`${MError.US03} - ${new Date().toLocaleTimeString()}`);
          return "US03";
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
    } catch (error) {
      CustomError.createError({
        name:"Error en validación de Token",
        cause:generateErrorSys(user),
        message: MError.SYS03,
        errorCode: EError.AUTH_ERROR
      });
      logger.info(`${MError.SYS03} - ${user} - ${new Date().toLocaleTimeString()}`);
      return "SYS03";
    }
  }
}
