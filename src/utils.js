import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import { fakerES as faker } from '@faker-js/faker'

import { config } from "./config/config.js";
const tokenSecret = config.token.secret;
import jwt from "jsonwebtoken";

import multer from "multer";

// Debemos crear nuestra propia variable __dirname a través de este método si usamos ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//const secretToken = "coder-key";

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (dbPassword, loginPassword) => {
  return bcrypt.compareSync(loginPassword, dbPassword);
};

export const generateToken = (user) => {
  const token = jwt.sign(
    {
      _id: user._id,
      first_name: user.first_name,
      email: user.email,
      role: user.role,
    },
    tokenSecret,
    { expiresIn: "24h" }
  );
  return token;
};

export const generateProduct = ()=>{
  return {
      id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      thumbnail: faker.image.url(),
      code: faker.string.alphanumeric(10),
      stock: parseInt(faker.string.numeric(2)),
      category: faker.commerce.department(),
      status: faker.datatype.boolean(),
  }
}

export const generateEmailToken = (user,expireTime)=>{
  const token = jwt.sign(
      {
       email: user
      },
      tokenSecret,
      { expiresIn: expireTime }
    );
  return token;
};

export const verifyEmailToken = (token)=>{
  try {
      const info = jwt.verify(token,tokenSecret);
      return info.email;
  } catch (error) {
      //console.log(error.message);
      return null;
  }
};


const profileStorage = multer.diskStorage({
  destination: function(req,file,cb){
      cb(null,path.join(__dirname,"/files/users/images"))
  },
  filename: function(req,file,cb){
      cb(null,`${req.params.uid}-profile-${file.originalname}`)
  }
});
export const uploaderProfile = multer({storage:profileStorage});


const documentStorage = multer.diskStorage({
  destination: function(req,file,cb){
      cb(null,path.join(__dirname,"/files/users/documents"))
  },
  filename: function(req,file,cb){
      cb(null,`${req.params.uid}-documents-${file.originalname}`)
  }
});
export const uploaderDocument = multer({storage:documentStorage});


const productStorage = multer.diskStorage({
  destination: function(req,file,cb){
      cb(null,path.join(__dirname,"/files/products/images"))
  },
  filename: function(req,file,cb){
      cb(null,`${req.body.code}-image-${file.originalname}`)
  }
});
export const uploaderProduct = multer({storage:productStorage});

export default __dirname;