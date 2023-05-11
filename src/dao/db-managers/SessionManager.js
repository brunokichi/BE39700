import { createHash, isValidPassword } from "../../utils.js";
import userModel from "../models/UserModel.js";

import { config } from "../../config/config.js";
const adminUser = config.admin.user;
const adminSecret = config.admin.secret;

export default class SessionManager {
  profileUser = async (id) => {
    //console.log(id);
    try {
      const findUser = await userModel.findOne({ _id: id });
      return findUser;
    } catch (e) {
      return "Se produjo un error al buscar el usuario";
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
      return "1";
    } else {
      try {
        const validEmail = await userModel.findOne({ email: email });
        if (validEmail) {
          //Error! El email ${email} ya se encuentra registrado;
          return "97";
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
            return "98";
          }
        }
      } catch (e) {
        //Se produjo un error al validar el email;
        return "96";
      }
    }
  };

  loginUser = async (user, password) => {
    if (!user || !password) {
      //Error! Algún campo está incompleto;
      return "1";
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
            return "2";
          }
        } catch (e) {
          //Se produjo un error al validar el usuario;
          return "3";
        }
      }
    }
  };
}
