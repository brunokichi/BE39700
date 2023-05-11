import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

import { config } from "./config/config.js";
const tokenSecret = config.token.secret;
//import { log } from "console";

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

export default __dirname;
