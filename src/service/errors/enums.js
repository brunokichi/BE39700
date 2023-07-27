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
    US03: "Error! La contraseña ya fue utilizada anteriormente", //3
    US04: "Error! Perfil de usuario incorrecto / inexistente",
    US05: "Error! Documentacion de usuario incompleta",
    //
    AUTH01: "Error! Usuario y/o contraseña incorrecto", //2
    AUTH02: "Error! Acceso no autorizado", //4
    AUTH03: "Error! Usuario incorrecto", //5
    AUTH04: "Error! Token inválido / vencido",
    AUTH05: "Error! Producto no habilitado para el usuario",
    //
    DB01: "Error! No se pudo validar el email al crear el usuario", //96
    DB02: "Error! No se pudo registrar al usuario", //98
    DB03: "Error! No se pudieron buscar el / los usuarios",
    DB04: "Error! No se pudieron buscar el / los productos",
    DB05: "Error! No se pudo crear el / los productos",
    DB06: "Error! No se pudo actualizar o eliminar un producto",
    DB07: "Error! No se pudo buscar el/los carritos",
    DB08: "Error! No se pudo crear el carrito",
    DB09: "Error! No se pudo generar el ticket",
    DB10: "Error! No se pudo actualizar el carrito",
    DB11: "Error! No se pudo encontrar el ticket",
    //
    DE01: "Usuario eliminado de manera correcta",
    DE02: "Usuarios inactivos eliminados de manera correcta",
    DE03: "Error! No se encontraron usuarios inactivos",
    //
    PR01: "Error! Algún campo está incompleto o es incorrecto",
    PR02: "Error! Código de producto ya ingresado",
    PR03: "Error! Algún campo está incompleto",
    PR04: "Error! ID de producto inexistente",
    PR05: "Stock insuficiente",
    //
    SYS01: "Error! No se pudo crearle un carrito al usuario", //95
    SYS02: "Error! No se pudo enviar el mail de recupero de contraseña",
    SYS03: "Error! No se pudo validar el Token",
    SYS04: "Error! No se pudo actualizar el rol de usuario",
    SYS05: "Error! No se pudieron eliminar los usuarios",
    //
    CA01: "Carrito sin productos",
    CA02: "Carrito inexistente",
    CA03: "No hay stock suficiente para realizar la operación",
    CA04: "Se produjo un error al generar el ticket en CartManager",
    //
    GEN99: "Se produjo un error, intente más tarde",
}