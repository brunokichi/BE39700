import winston from "winston";
import { config } from "../config/config.js";

const node_env = config.logger.node_env;
//console.log(node_env);

const customLevelsOptions = {
    levels:{
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5
    },
    colors:{
        fatal:"red",
        error:"red",
        warning:"yellow",
        info:"blue",
        http:"green",
        debug:"white"
    }
}

const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports:[
        new winston.transports.Console({
            level:"debug",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            )
        })
    ]
});

const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports:[
        new winston.transports.Console({ 
            level: "info",
            //level: "debug",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename:"src/logs/errors.log",
            level: "error",
            //level: "debug",
            format: winston.format.simple()
        })
    ]
});

const currentEnv = node_env || "development";

let currentLogger;

const addLogger = ()=>{
    if(currentEnv === "development"){
        currentLogger = devLogger;
    } else {
        currentLogger = prodLogger;
    }
    return currentLogger;
}

export { addLogger, currentEnv}

/*export const addLogger = (req,res,next)=>{
    if(currentEnv === "development"){
        req.logger = devLogger;
        req.logger.debug("Entorno de Desarrollo");
        //currentLogger = devLogger;
    } else {
        req.logger = prodLogger;
        req.logger.info("Entorno de Produccion");
        //currentLogger = prodLogger;
    }
    req.logger.http(`${req.url} - Method: ${req.method} - Environment: ${currentEnv} - ${new Date().toLocaleTimeString()}`);
    next();
}*/