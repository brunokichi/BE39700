import userModel from "../models/UserModel.js";

export default class SessionManager {
  addUser = async (first_name, last_name, email, age, password, rol = "usuario" )=> {

    if (!first_name || !last_name || !email || !age || !password ) {
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
                password,
                rol
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

  loginUser = async (user, password )=> {
    if (!user || !password) {
      //Error! Algún campo está incompleto;
      return "1";
    } else {
      if (user === "adminCoder@coder.com" && password === "adminCod3r123") {
        //Acceso correcto
        return ({email: user});
      } else {
        try {
          const findUser = await userModel.findOne({email: user, password: password})
          if(!findUser){
            //Error! Usuario y/o contraseña incorrecto;
            return "2";
          } else {
            //Acceso correcto
            return (findUser);
          }
        } catch (e) {
          //Se produjo un error al validar el usuario;
          return "3";
        }
      }
    }
  }

  profileUser = async (user)=> {
    try {
      const findUser = await userModel.findOne({email: user});
      return (findUser);
    } catch (e) {
      return "Se produjo un error al buscar el usuario";
    }
  }
}