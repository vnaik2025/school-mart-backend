import db from '../models/index.js';
import { APIError } from '../utils/api-error.js';

export const getActiveCart = async (userId) => {
  const cart = await db.Cart.findOne({
    where: { user_id: userId, status: 'ACTIVE' },
    include: [
      {
        model: db.School,
        attributes: ['id', 'name', 'status']
      },
      {
        model: db.CartItem,
        include: [
          {
            model: db.UniformVariant,
            include: [
              {
                model: db.Uniform,
                attributes: ['id', 'name', 'sku', 'description']
              }
            ]
          }
        ]
      }
    ]
  });

  if (!cart) {
    return { cart: null, subtotal: 0, total_items: 0 };
  }

  // Calculate totals
  let subtotal = 0;
  let totalItems = 0;

  for (const item of cart.CartItems) {
    if (item.UniformVariant) {
      const price = parseFloat(item.UniformVariant.price) || 0;
      subtotal += price * item.quantity;
      totalItems += item.quantity;
    }
  }

  return {
    cart,
    subtotal: parseFloat(subtotal.toFixed(2)),
    total_items: totalItems
  };
};

export const addItemToCart = async (userId, variantId, quantity, schoolId) => {
  // 1. Validate the variant exists and is active
  const variant = await db.UniformVariant.findOne({
    where: { id: variantId, is_archive: false, status: 'ACTIVE' },
    include: [{ model: db.Uniform }]
  });

  if (!variant) {
    throw new APIError('Uniform variant not found or inactive', 404);
  }

  if (quantity < variant.quantity_requirement) {
    throw new APIError(`Minimum quantity requirement is ${variant.quantity_requirement}`, 400);
  }

  // 2. Validate the school exists
  const school = await db.School.findOne({ where: { id: schoolId, is_archive: false, status: 'ACTIVE' } });
  if (!school) {
    throw new APIError('School not found or inactive', 404);
  }

  // 3. Validate mapping: Does this uniform belong to the provided school?
  const mapping = await db.UniformSchoolMapping.findOne({
    where: { school_id: schoolId, uniform_id: variant.uniform_id, is_active: true }
  });
  if (!mapping) {
    throw new APIError('This product is not available for the specified school', 400);
  }

  // 4. Handle active cart logic
  return await db.sequelize.transaction(async (t) => {
    let cart = await db.Cart.findOne({
      where: { user_id: userId, status: 'ACTIVE' },
      transaction: t
    });

    if (cart) {
      if (parseInt(cart.school_id, 10) !== parseInt(schoolId, 10)) {
        throw new APIError('You have items from a different school in your cart. Please clear your cart first.', 400);
      }
    } else {
      cart = await db.Cart.create({
        user_id: userId,
        school_id: schoolId,
        status: 'ACTIVE'
      }, { transaction: t });
    }

    // 5. Add or update CartItem
    let cartItem = await db.CartItem.findOne({
      where: { cart_id: cart.id, variant_id: variantId },
      transaction: t
    });

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;
      await cartItem.update({ quantity: newQuantity }, { transaction: t });
    } else {
      cartItem = await db.CartItem.create({
        cart_id: cart.id,
        variant_id: variantId,
        quantity
      }, { transaction: t });
    }

    return cartItem;
  });
};

export const updateItemQuantity = async (userId, itemId, quantity) => {
  const cart = await db.Cart.findOne({ where: { user_id: userId, status: 'ACTIVE' } });
  if (!cart) {
    throw new APIError('No active cart found', 404);
  }

  const cartItem = await db.CartItem.findOne({
    where: { id: itemId, cart_id: cart.id },
    include: [{ model: db.UniformVariant }]
  });

  if (!cartItem) {
    throw new APIError('Cart item not found', 404);
  }

  if (quantity === 0) {
    await cartItem.destroy();
    return null;
  }

  const minQuantity = cartItem.UniformVariant ? cartItem.UniformVariant.quantity_requirement : 1;
  if (quantity < minQuantity) {
    throw new APIError(`Minimum quantity requirement is ${minQuantity}`, 400);
  }

  await cartItem.update({ quantity });
  return cartItem;
};

export const removeItem = async (userId, itemId) => {
  const cart = await db.Cart.findOne({ where: { user_id: userId, status: 'ACTIVE' } });
  if (!cart) {
    throw new APIError('No active cart found', 404);
  }

  const cartItem = await db.CartItem.findOne({
    where: { id: itemId, cart_id: cart.id }
  });

  if (!cartItem) {
    throw new APIError('Cart item not found', 404);
  }

  await cartItem.destroy();
};

export const clearCart = async (userId) => {
  const cart = await db.Cart.findOne({ where: { user_id: userId, status: 'ACTIVE' } });
  if (!cart) {
    throw new APIError('No active cart found', 404);
  }

  await db.sequelize.transaction(async (t) => {
    await db.CartItem.destroy({ where: { cart_id: cart.id }, transaction: t });
    await cart.update({ status: 'ABANDONED' }, { transaction: t }); // Or we can just destroy the cart, but ABANDONED is good for analytics
  });
};

export default {
  getActiveCart,
  addItemToCart,
  updateItemQuantity,
  removeItem,
  clearCart
};
