export const generateErrorAuth = (user, password)=>{
    let errorPassword = 0, errorUser = 0;
    if (password) {
        errorPassword = password.length;
    }
    if (!user) {
        errorUser = "sin informacion";
    } else {
        errorUser = user;
    }
    return `
        Error! Algun campo está incompleto o es incorrecto
        Campos requeridos:
        Usuario: debe ser una cadena de caracteres, y se recibio ${errorUser},
        Contraseña: no debe estar incompleto, y se recibieron ${errorPassword} caracteres.
    `
}