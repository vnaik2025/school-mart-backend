import cartService from '../services/cart.service.js';
import { sendSuccess } from '../utils/response-handler.js';

export const getActiveCart = async (req, res, next) => {
  try {
    const cart = await cartService.getActiveCart(req.user.id);
    return sendSuccess(res, cart, 'Cart retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const addItemToCart = async (req, res, next) => {
  try {
    const { variant_id, quantity, school_id } = req.body;
    const item = await cartService.addItemToCart(req.user.id, variant_id, quantity, school_id);
    return sendSuccess(res, item, 'Item added to cart successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateItemQuantity = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params;
    const item = await cartService.updateItemQuantity(req.user.id, parseInt(id, 10), quantity);
    return sendSuccess(res, item, 'Cart item updated successfully');
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    await cartService.removeItem(req.user.id, parseInt(id, 10));
    return sendSuccess(res, null, 'Cart item removed successfully');
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    await cartService.clearCart(req.user.id);
    return sendSuccess(res, null, 'Cart cleared successfully');
  } catch (error) {
    next(error);
  }
};

export default {
  getActiveCart,
  addItemToCart,
  updateItemQuantity,
  removeItem,
  clearCart
};
