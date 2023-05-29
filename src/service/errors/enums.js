export const EError = {
    USU_ERROR: 1,
    DB_ERROR:2, 
    AUTH_ERROR:3, 
    PRODUCT_ERROR:4,
    SYS_ERROR:5,
}

export const MError = {
    US01: "Error! Algún campo está incompleto", //1
    US02: "Error! El email ya se encuentra registrado", //97
    //US03: "Error! No se pudo validar el usuario", //3
    //
    AUTH01: "Error! Usuario y/o contraseña incorrecto", //2
    AUTH02: "Error! Acceso no autorizado", //4
    //
    DB01: "Error! No se pudo validar el email al crear el usuario", //96
    DB02: "Error! No se pudo registrar al usuario", //98
    DB03: "Error! No se pudo buscar el usuario",
    DB04: "Error! No se pudieron buscar el/los productos",
    DB05: "Error! No se pudo crear el/los productos",
    DB06: "Error! No se pudo actualizar o eliminar un producto",
    DB07: "Error! No se pudo buscar el/los carritos",
    DB08: "Error! No se pudo crear el carrito",
    DB09: "Error! No se pudo generar el ticket",
    //
    PR01: "Error! Algún campo está incompleto o es incorrecto",
    PR02: "Error! Código de producto ya ingresado",
    PR03: "Error! Algún campo está incompleto",
    PR04: "Error! ID de producto inexistente",
    //
    SYS01: "Error! No se pudo crearle un carrito al usuario", //95
}