import deliveryService from '../services/delivery.service.js';
import { sendSuccess } from '../utils/response-handler.js';

export const createDelivery = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const trackingData = req.body;
    
    const delivery = await deliveryService.createDelivery(parseInt(orderId, 10), req.user.id, trackingData);
    return sendSuccess(res, delivery, 'Delivery initiated successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, ...trackingData } = req.body;
    
    const delivery = await deliveryService.updateDeliveryStatus(parseInt(orderId, 10), status, trackingData, req.user.id);
    return sendSuccess(res, delivery, 'Delivery status updated successfully');
  } catch (error) {
    next(error);
  }
};

export const getDeliveryDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const delivery = await deliveryService.getDeliveryDetails(req.user.id, req.user.role, parseInt(orderId, 10));
    return sendSuccess(res, delivery, 'Delivery details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export default {
  createDelivery,
  updateDeliveryStatus,
  getDeliveryDetails
};
