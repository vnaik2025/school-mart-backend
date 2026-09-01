import paymentService from '../services/payment.service.js';
import { sendSuccess } from '../utils/response-handler.js';

export const simulatePayment = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { outcome } = req.body;
    
    const result = await paymentService.simulatePayment(req.user.id, parseInt(orderId, 10), outcome);
    return sendSuccess(res, result, `Payment simulation ${outcome.toLowerCase()} processed`);
  } catch (error) {
    next(error);
  }
};

export const getPaymentDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const payment = await paymentService.getPaymentDetails(req.user.id, req.user.role, parseInt(orderId, 10));
    return sendSuccess(res, payment, 'Payment details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export default {
  simulatePayment,
  getPaymentDetails
};
