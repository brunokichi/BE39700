import ticketModel from "../models/TicketModel.js";
import {v4 as uuidv4} from 'uuid';

import { CustomError } from "../../service/errors/error.service.js";
import { EError, MError } from "../../service/errors/enums.js";
import { generateErrorDB } from "../../service/errors/errorDatabase.js";

export default class TicketManager {

  addTicket = async (products, amount, email) => {
    const ticket = {
      code:uuidv4(),
      purchase_datetime: new Date(),
      products: products,
      amount: amount,
      purchaser: email
    }
    try {
      const newTicket = await ticketModel.create(ticket);
      return `${newTicket}`;
    } catch (e) {
        //return "Se produjo un error al generar un nuevo ticket en la db";
        CustomError.createError({
          name:"DB Error en generacion de ticket en TicketManager",
          cause:generateErrorDB(MError.DB09),
          message: MError.DB09,
          errorCode: EError.DB_ERROR
        });
        return "Se produjo un error al generar el ticket";
    }
  };
}
