export const generateErrorUser = (first_name, last_name, email, age, password)=>{
    let errorPassword = 0;
    if (password) {
        errorPassword = password.length;
    } 
    return `
        Error! Algun campo está incompleto
        Campos requeridos:
        Nombre: debe ser una cadena de caracteres, pero se recibio ${first_name},
        Apellido: debe ser una cadena de carateres, pero se recibio ${last_name},
        Email: debe ser una cadena de caracteres, pero se recibio ${email},
        Edad: debe ser un entero, pero se recibio ${age},
        Contraseña: no debe estar incompleto, pero se recibieron ${errorPassword} caracteres.
    `
}