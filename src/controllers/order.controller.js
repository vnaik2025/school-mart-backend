import orderService from '../services/order.service.js';
import { sendSuccess } from '../utils/response-handler.js';

export const checkout = async (req, res, next) => {
  try {
    const { address_id } = req.body;
    const order = await orderService.createOrder(req.user.id, address_id);
    return sendSuccess(res, order, 'Order placed successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const listOrders = async (req, res, next) => {
  try {
    const data = await orderService.listOrders(req.user.id, req.user.role, req.query);
    return sendSuccess(res, data, 'Orders retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getOrderDetails = async (req, res, next) => {
  try {
    const order = await orderService.getOrderDetails(req.user.id, req.user.role, parseInt(req.params.id, 10));
    return sendSuccess(res, order, 'Order details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(parseInt(req.params.id, 10), status, req.user.id);
    return sendSuccess(res, order, 'Order status updated successfully');
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder(req.user.id, req.user.role, parseInt(req.params.id, 10));
    return sendSuccess(res, order, 'Order cancelled successfully');
  } catch (error) {
    next(error);
  }
};

export default {
  checkout,
  listOrders,
  getOrderDetails,
  updateOrderStatus,
  cancelOrder
};
