import { EError } from "../../service/errors/enums.js";

export const errorHandler = (error, req, res, next)=>{
    switch (error.code) {
        case EError.USU_ERROR:
            res.json({status:"Error", error:error.cause, message: error.message})
            break;
        case EError.AUTH_ERROR:
            res.json({status:"Error", error:error.cause, message: error.message})
            break;
        case EError.PRODUCT_ERROR:
            res.json({status:"Error", error:error.cause, message: error.message})
            break;
        case EError.DB_ERROR:
            res.json({status:"Error", error:error.cause, message: error.message})
            break;
        case EError.SYS_ERROR:
            res.json({status:"Error", error:error.cause, message: error.name})
            break;
        default:
            res.json({status:"Error", message:"Error desconocido"})
            break;
    }
}