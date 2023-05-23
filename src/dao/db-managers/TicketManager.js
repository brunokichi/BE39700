import ticketModel from "../models/TicketModel.js";
import {v4 as uuidv4} from 'uuid';

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
        return "Se produjo un error al generar un nuevo ticket en la db";
    }
  };
}
