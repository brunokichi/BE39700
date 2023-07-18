import { UserService } from "../service/user.service.js";
import { CustomError } from "../service/errors/error.service.js";
import { EError, MError } from "../service/errors/enums.js";
import { generateErrorSys } from "../service/errors/errorSys.js";
import { addLogger } from "../utils/logger.js";
const logger = addLogger();

class UsersController{
    static changeRol = async (req,res)=>{
        if (req.body.userid) {
            res.redirect('/api/users/premium/' + req.body.userid);
        } else {
            const userId = req.params.uid;
            try {
                const changeRol = await UserService.changeRol(userId);
                res.redirect('/changerol?result=' + changeRol);
            } catch (e) {
                CustomError.createError({
                    name:"Error al actualizar el rol de usuario",
                    cause:generateErrorSys(e.message),
                    message: MError.SYS04,
                    errorCode: EError.AUTH_ERROR
                  });
                  logger.info(`${MError.SYS04} - ${e.message} - ${new Date().toLocaleTimeString()}`);
                  const mensajeResultado = MError.SYS04;
                  res.render("changerol", { mensajeResultado });
            }
        }
    };

    static uploadAvatar = async (req,res)=>{
        const userId = req.params.uid;
        const uploadAvatar = await UserService.uploadAvatar(userId, req.file.filename);
        res.redirect('/profile?result=' + uploadAvatar);
    };

    static uploadDoc = async (req,res)=>{
        const userId = req.params.uid;
        const uploadDoc = await UserService.uploadDoc(userId, req.files);
        res.redirect('/profile?result=' + uploadDoc);
    };
}

export { UsersController }