import __dirname from "../utils.js";
import swaggerJsDoc from "swagger-jsdoc";
import path from "path";

const swaggerOptions = {
    definition:{
        openapi:"3.0.1",
        info:{
            title:"Documentacion de E-commerce",
            description:"Api rest para gestionar el e-commerce",
            version:"1.0.0"
        }
    },
    apis:[`${path.join(__dirname,"/docs/**/*.yaml")}`],
    
};

export const swaggerSpecs = swaggerJsDoc(swaggerOptions);