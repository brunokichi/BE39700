import passport from "passport";
import LocalStrategy from "passport-local";
import GithubStrategy from "passport-github2";

import jwt from "passport-jwt";

import userModel from "../dao/models/UserModel.js"
import { createHash, isValidPassword } from "../utils.js";

import { config } from "../config/config.js";
const tokenSecret = config.token.secret;
const tokenCookie = config.token.cookie;

const jwtStrategy = jwt.Strategy;
const extractJwt = jwt.ExtractJwt;

//const secret = tokenSecret;

const initializePassport = ()=>{
    
  passport.use("registerLocal",new LocalStrategy(        
        {
            usernameField: "email",
            passReqToCallback:true
        },
        async (req, username, password, done) => {
            const { first_name, last_name, age } = req.body;
            const rol = "usuario";

            if (!first_name || !last_name || !username || !age || !password ) {
                //return "1";
                console.log("Error! Algún campo está incompleto");
                return done(null, false);
            }

            try {
                const validEmail = await userModel.findOne({ email: username });
                if (validEmail) {
                  //return "97";
                  console.log("Error! El email ya se encuentra registrado");
                  return done(null, false);
                }

                try {
                    const newUser = await userModel.create({
                      first_name,
                      last_name,
                      email: username,
                      age,
                      password: createHash(password),
                      rol,
                    });
                    //Usuario registrado de manera exitosa;
                    //return "OK99";
                    return done(null, newUser);
                  } catch (e) {
                    //Se produjo un error al registrar el usuario;
                    //return "98";
                    return done(e);
                  }
            } catch (e) {
                //Se produjo un error al validar el email;
                //return "96";
                return done(e);
            }
        }
  ));

  passport.use("loginLocal", new LocalStrategy(
        { 
            usernameField: "user" 
        },
        async(username, password, done) => {
            
            if (!username || !password) {
                //return "1";
                console.log("Error! Algún campo está incompleto");
                return done(null, false)
            }
            try {
              const findUser = await userModel.findOne({email: username})
                if(findUser && isValidPassword(findUser.password,password)){
                  //return (findUser);
                  console.log("Acceso correcto");
                  return done(null, findUser);
                } else {
                  //return "2";
                  console.log("Error! Usuario y/o contraseña incorrecto");
                  return done(null, false)
                }
              } catch (e) {
                //return "3";
                console.log("Se produjo un error al validar el usuario");
                return done(null, false)
              }
        }
  ))

  passport.use("loginJWT", new jwtStrategy(
    {
        jwtFromRequest: extractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: tokenSecret
    },
      async(jwt_payload,done)=>{
        try {
            return done(null,jwt_payload)
        } catch (error) {
          return done(error);
        }
    }
  ))

  
  passport.use("github", new GithubStrategy(
    {
      clientID: "Iv1.4416828e59d70bbf",
      clientSecret: "be9655341ebcf5a6f54d9686f003755cc7eb0715",
      callbackUrl: "http://localhost:8080/api/sessions/github-callback",
    },
    async (accessToken, refreshToken, profile, done ) => {
      try {
        const cheqEmail = await userModel.findOne({ email: profile.username });
        if (!cheqEmail) {
          try {
            const newUser = await userModel.create({
              first_name: profile.displayName,
              last_name: null,
              email: profile.username,
              age: null,
              password: null,
              rol: "Usuario Github"
            });
            //Usuario registrado de manera exitosa;
            //return "OK99";
            return done(null, newUser);
          } catch (e) {
            //Se produjo un error al registrar el usuario;
            //return "98";
            return done(e);
          }
          
        }
        //Email ya se encuentra registrado, permito login
        return done(null, cheqEmail);

      } catch (error) {
        return done(error);
      }
    }
  ))

  passport.serializeUser((user,done)=>{
        done(null,user._id);
  });

    passport.deserializeUser(async(id,done)=>{
        const user = await userModel.findById(id);

        return done(null, user);
    });
};

const cookieExtractor = (req)=>{
  let token = null;
  if(req && req.cookies){
      token = req.cookies[tokenCookie]
  }
  return token;
}

export { initializePassport, cookieExtractor };

