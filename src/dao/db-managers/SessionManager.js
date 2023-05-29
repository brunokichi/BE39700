import { createHash, isValidPassword } from "../../utils.js";
import userModel from "../models/UserModel.js";

import { config } from "../../config/config.js";
const adminUser = config.admin.user;
const adminSecret = config.admin.secret;


import { CustomError } from "../../service/errors/error.service.js";
import { EError, MError } from "../../service/errors/enums.js";
import { generateErrorUser } from "../../service/errors/errorUser.js";
import { generateErrorDB } from "../../service/errors/errorDatabase.js";
import { generateErrorAuth } from "../../service/errors/errorAuth.js";

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
      return "DB03";
    }
  };

  addUser = async (
    first_name,
    last_name,
    email,
    age,
    password,
    rol = "Usuario"
  ) => {
    if (!first_name || !last_name || !email || !age || !password) {
      //Error! Algún campo está incompleto;
      //return "1";
      CustomError.createError({
        name:"Error en creacion de usuario",
        cause:generateErrorUser(first_name, last_name, email, age, password),
        message: MError.US01,
        errorCode: EError.USU_ERROR
      });
      return "US01";
    } else {
      try {
          const validEmail = await userModel.findOne({ email: email });
          if (validEmail) {
            //Error! El email ${email} ya se encuentra registrado;
            //return "97";
            CustomError.createError({
              name:"Error en creacion de usuario",
              cause:generateErrorUser(first_name, last_name, email, age, password),
              message: MError.US02,
              errorCode: EError.USU_ERROR
            });
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
              //Usuario registrado de manera exitosa;
              return "99";
            } catch (e) {
              //Se produjo un error al registrar el usuario;
              //return "98";
              CustomError.createError({
                name:"DB Error en creacion de usuario",
                cause:generateErrorDB(MError.DB02),
                message: MError.DB02,
                errorCode: EError.DB_ERROR
              });
              return "DB02";
            }
          }
      } catch (e) {
          //Se produjo un error al validar el email;
          //return "96";
          CustomError.createError({
            name:"DB Error en creacion de usuario",
            cause:generateErrorDB(MError.DB01),
            message: MError.DB01,
            errorCode: EError.DB_ERROR
          });
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
        //return "95";
        CustomError.createError({
          name:"SYS Error en perfil de usuario al asignar carrito",
          cause:generateErrorDB(MError.SYS01),
          message: MError.SYS01,
          errorCode: EError.SYS_ERROR
        });
        return "DB01";
      }
      try {
        const result = await userModel.updateOne({ _id: validEmail._id} ,  {cart: resCart});
        //return result;
        //Usuario registrado de manera exitosa;
        return "99";
      } catch (e) {
        //Se produjo un error al registrar el usuario;
        //return "98";
        CustomError.createError({
          name:"DB Error en asignacion de carrito al crear usuario",
          cause:generateErrorDB(MError.DB02),
          message: MError.DB02,
          errorCode: EError.DB_ERROR
        });
        return "DB02";
      }
    } catch (e) {
      //return "96";
      CustomError.createError({
        name:"DB Error en asignacion de carrito al crear usuario",
        cause:generateErrorDB(MError.DB01),
        message: MError.DB01,
        errorCode: EError.DB_ERROR
      });
      return "DB01";
    }
  }

  loginUser = async (user, password) => {
    if (!user || !password) {
      //Error! Algún campo está incompleto;
      //return "1";
      CustomError.createError({
        name:"Error en ingreso de usuario",
        cause:generateErrorAuth(user, password),
        message: MError.US01,
        errorCode: EError.AUTH_ERROR
      });
      return "US01";
    } else {
      if (user === adminUser && password === adminSecret) {
        //Acceso correcto
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
            //Acceso correcto
            return findUser;
          } else {
            //Error! Usuario y/o contraseña incorrecto;
            //return "2";
            CustomError.createError({
              name:"Error en validacion al ingreso de usuario",
              cause:generateErrorAuth(user, password),
              message: MError.AUTH01,
              errorCode: EError.AUTH_ERROR
            });
            return "AUTH01";
          }
        } catch (e) {
          //Se produjo un error al validar el usuario;
          //return "3";
          CustomError.createError({
            name:"DB Error en busqueda de usuario",
            cause:generateErrorDB(MError.DB03),
            message: MError.DB03,
            errorCode: EError.DB_ERROR
          });
          return "DB03";
        }
      }
    }
  };
}
