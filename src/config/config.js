import dotenv from 'dotenv'

dotenv.config();

const PORT = process.env.PORT;
const MONGO_DB_USER = process.env.MONGO_DB_USER;
const MONGO_DB_PASS = process.env.MONGO_DB_PASS;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const TOKEN_COOKIE = process.env.TOKEN_COOKIE;
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_SECRET = process.env.ADMIN_SECRET;
const NODE_ENV = process.env.NODE_ENV;

export const config = {
    db:{
        mongoUrl:`mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASS}@coder.0pay6zu.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority`
    },
    server:{
        port:PORT,
    },
    token:{
        secret:TOKEN_SECRET,
        cookie:TOKEN_COOKIE,
    },
    admin:{
        user:ADMIN_USER,
        secret:ADMIN_SECRET,
    },
    logger:{
        node_env:NODE_ENV,
    }
}