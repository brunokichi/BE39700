import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
//import { log } from "console";

// Debemos crear nuestra propia variable __dirname a través de este método si usamos ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createHash = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword=(dbPassword,loginPassword)=>{
   console.log(dbPassword);
   console.log(loginPassword);
    return bcrypt.compareSync(loginPassword,dbPassword);
}

export default __dirname;
