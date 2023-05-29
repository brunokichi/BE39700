export const generateErrorProduct = (tipo, mensaje, title, description, code, price, stock, category, id)=>{
    if (tipo == "completo") {
        return `
            ${mensaje}    
            Campos requeridos:
            Titulo: debe ser una cadena de caracteres, y se recibio ${title},
            Descripcion: debe ser una cadena de carateres, y se recibio ${description},
            Codigo: debe ser una cadena de caracteres, y se recibio ${code},
            Precio: debe ser un entero, y se recibio ${price},
            Stock: debe ser un entero, y se recibio  ${stock},
            Categoria: debe ser una cadena de carateres, y se recibio ${category}.
        `
    } else {
        return `
            ${mensaje}    
            Product ID: ${id}
        `
    }
}