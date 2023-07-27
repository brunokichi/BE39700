import nodemailer from "nodemailer"
import { config } from "../config/config.js";

const transporter = nodemailer.createTransport({
    service: config.email.email_service,
    port: config.email.email_port,
    auth:{
        user: config.email.email_admin,
        pass: config.email.email_secret
    },
    secure:false,
    tls:{
        rejectUnauthorized:false
    }
});

export const sendRecoveryPass = async(email,token)=>{
    const link = `http://localhost:${config.server.port}/resetpassword?user=${email}&token=${token}`;

    await transporter.sendMail({
        from: config.email.email_admin,
        to: email,
        subject: "Solicitud de reinicio de contraseña",
        html:`
            <div>
                <h1>Solicitud de reinicio de contraseña</h1>
                <h2>Para continuar con el proceso hace clic en el siguiente enlace</h2>
                <a href="${link}">
                    <button> Restablecer </button>
                </a>
                <h4>Si no lo solicitaste comunicate con el Administrador</h4>
            </div>
        `
    })
};

export const sendTicket = async (ticketProducts, amount, email) => {
    let productoshtml = "";
    ticketProducts.forEach(elemento => {
        productoshtml += `<div>
                            <p>Código: ${elemento.product}</p>
                            <p>Cantidad: ${elemento.quantity}</p>
                          </div>`;
    });
    await transporter.sendMail({
        from: config.email.email_admin,
        to: email,
        subject: "Orden de compra generada",
        html:`
            <div>
                <h1>Productos</h1>
                ${productoshtml}
                <h2>Costo: $ ${amount}</h2>
            </div>
        `
    })
}

export const sendDeleteUser = async (email, first_name, last_name) => {
    await transporter.sendMail({
        from: config.email.email_admin,
        to: email,
        subject: "Usuario eliminado del sistema",
        html:`
            <div>
                <h1>Estimado ${first_name} ${last_name}</h1>
                <p>
                    Su usuario ha sido eliminado de nuestro sistema. 
                    Ante cualquier duda pongase en contacto con nosotros
                </p>
            </div>
        `
    })
}

export const sendDeleteProduct = async (email, first_name, last_name, product_id) => {
    await transporter.sendMail({
        from: config.email.email_admin,
        to: email,
        subject: "Producto eliminado del sistema",
        html:`
            <div>
                <h1>Estimado ${first_name} ${last_name}</h1>
                <p>
                    El producto cuyo ID es ${product_id}  ha sido eliminado de nuestro sistema. 
                    Ante cualquier duda pongase en contacto con nosotros
                </p>
            </div>
        `
    })
}