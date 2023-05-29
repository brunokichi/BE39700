export const generateErrorDB= (error_servicio)=>{
    return `
        ${error_servicio}
        Chequear estado del servidor de base de datos y/o conexión
    `
}