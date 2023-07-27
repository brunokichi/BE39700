import ticketModel from "../models/TicketModel.js";
import {v4 as uuidv4} from 'uuid';

import { CustomError } from "../../service/errors/error.service.js";
import { EError, MError } from "../../service/errors/enums.js";
import { generateErrorDB } from "../../service/errors/errorDatabase.js";

import { addLogger } from "../../utils/logger.js";
const logger = addLogger();

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
      return (newTicket);
    } catch (e) {
        //return "Se produjo un error al generar un nuevo ticket en la db";
        CustomError.createError({
          name:"DB Error en generacion de ticket en TicketManager",
          cause:generateErrorDB(MError.DB09),
          message: MError.DB09,
          errorCode: EError.DB_ERROR
        });
        logger.error(`${MError.DB09} - ${new Date().toLocaleTimeString()}`);
        return "Se produjo un error al generar el ticket";
    }
  };

  getTicketById = async (idTicket) => {
    try {
      const ticket = await ticketModel
        .findOne({ code: idTicket })
        .lean()
        .populate("products.product");;
      //.populate("products.product");
      return ticket;
    } catch (e) {
      CustomError.createError({
        name:"DB Error en busqueda de ticket",
        cause:generateErrorDB(MError.DB11),
        message: MError.DB11,
        errorCode: EError.DB_ERROR
      });
      logger.erro(`${MError.DB11} - ${new Date().toLocaleTimeString()}`);
      return "GEN99";
    }
  };
}
