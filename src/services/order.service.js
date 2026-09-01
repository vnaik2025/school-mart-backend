import db from '../models/index.js';
import { APIError } from '../utils/api-error.js';
import { Op } from 'sequelize';

export const createOrder = async (userId, addressId = null) => {
  // 1. Fetch Active Cart with relations
  const cart = await db.Cart.findOne({
    where: { user_id: userId, status: 'ACTIVE' },
    include: [
      { model: db.School },
      {
        model: db.CartItem,
        include: [
          {
            model: db.UniformVariant,
            include: [{ model: db.Uniform, include: [{ model: db.Category }] }]
          }
        ]
      }
    ]
  });

  if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
    throw new APIError('Your cart is empty or inactive', 400);
  }

  // 2. Resolve Customer Address
  let address;
  if (addressId) {
    address = await db.CustomerAddress.findOne({
      where: { id: addressId, user_id: userId, is_archive: false }
    });
    if (!address) throw new APIError('Provided address not found', 404);
  } else {
    address = await db.CustomerAddress.findOne({
      where: { user_id: userId, is_default: true, is_archive: false }
    });
    if (!address) throw new APIError('No default address found. Please provide an address_id.', 400);
  }

  // 3. Resolve Customer Profile
  const user = await db.User.findByPk(userId);
  const profile = await db.CustomerProfile.findOne({ where: { user_id: userId } });
  
  if (!profile) throw new APIError('Customer profile incomplete', 400);

  // 4. Calculate Totals
  let subtotal = 0;
  let totalItems = 0;
  let totalQuantity = 0;

  for (const item of cart.CartItems) {
    const variant = item.UniformVariant;
    if (!variant || variant.is_archive || variant.status !== 'ACTIVE') {
      throw new APIError(`Item ${variant?.Uniform?.name || item.id} is no longer available`, 400);
    }
    const price = parseFloat(variant.price);
    subtotal += price * item.quantity;
    totalItems += 1;
    totalQuantity += item.quantity;
  }

  // 5. Begin Transaction
  return await db.sequelize.transaction(async (t) => {
    // Generate Order Number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${dateStr}-${randomSuffix}`;

    // Create Order
    const order = await db.Order.create({
      order_number: orderNumber,
      customer_id: userId,
      school_id: cart.school_id,
      status: 'PENDING_PAYMENT',
      subtotal,
      grand_total: subtotal, // For phase 8, grand total equals subtotal (no tax/shipping yet)
      total_items: totalItems,
      total_quantity: totalQuantity,
      created_by: userId
    }, { transaction: t });

    // Create OrderItems
    const orderItemsData = cart.CartItems.map(item => {
      const variant = item.UniformVariant;
      const uniform = variant.Uniform;
      const categoryName = uniform.Category ? uniform.Category.name : 'Unknown';
      const unitPrice = parseFloat(variant.price);
      
      return {
        order_id: order.id,
        uniform_id: uniform.id,
        variant_id: variant.id,
        sku: uniform.sku,
        product_name: uniform.name,
        category_name: categoryName,
        size: variant.size,
        gender: variant.gender,
        unit_price: unitPrice,
        quantity: item.quantity,
        subtotal: unitPrice * item.quantity
      };
    });
    await db.OrderItem.bulkCreate(orderItemsData, { transaction: t });

    // Create OrderAddress Snapshot
    await db.OrderAddress.create({
      order_id: order.id,
      full_name: address.full_name,
      phone: address.phone || profile.phone,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2,
      landmark: address.landmark,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country
    }, { transaction: t });

    // Create OrderCustomer Snapshot
    await db.OrderCustomer.create({
      order_id: order.id,
      customer_name: `${profile.first_name} ${profile.last_name}`,
      email: user.email,
      phone: profile.phone || address.phone || 'N/A'
    }, { transaction: t });

    // Create OrderSchoolSnapshot
    const school = cart.School;
    await db.OrderSchoolSnapshot.create({
      order_id: order.id,
      school_name: school.name,
      school_address: school.address,
      contact_number: school.contact_email || 'N/A' // Using contact email or add actual field if exists
    }, { transaction: t });

    // Log History
    await db.OrderStatusHistory.create({
      order_id: order.id,
      status: 'PENDING_PAYMENT',
      remarks: 'Order placed, awaiting payment',
      changed_by: userId
    }, { transaction: t });

    // Mark cart as CHECKED_OUT
    await cart.update({ status: 'CHECKED_OUT' }, { transaction: t });

    return order;
  });
};

export const listOrders = async (userId, userRole, queryParams) => {
  const { page = 1, limit = 10, search, status } = queryParams;
  const offset = (page - 1) * limit;

  const where = {};

  // Restrict to user if not admin
  if (userRole !== 'ADMIN') {
    where.customer_id = userId;
  }

  if (status) {
    where.status = status;
  }

  if (search) {
    where.order_number = {
      [Op.iLike]: `%${search}%`
    };
  }

  const { count, rows } = await db.Order.findAndCountAll({
    where,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['created_at', 'DESC']]
  });

  return {
    total: count,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    data: rows
  };
};

export const getOrderDetails = async (userId, userRole, orderId) => {
  const order = await db.Order.findOne({
    where: { id: orderId },
    include: [
      { model: db.OrderItem },
      { model: db.OrderAddress },
      { model: db.OrderCustomer },
      { model: db.OrderSchoolSnapshot },
      { model: db.OrderStatusHistory }
    ]
  });

  if (!order) {
    throw new APIError('Order not found', 404);
  }

  if (userRole !== 'ADMIN' && parseInt(order.customer_id, 10) !== parseInt(userId, 10)) {
    throw new APIError('Access denied', 403);
  }

  return order;
};

export const updateOrderStatus = async (orderId, status, adminId) => {
  const order = await db.Order.findByPk(orderId);
  if (!order) throw new APIError('Order not found', 404);

  // Validate state transition (very basic check here, can be expanded)
  if (order.status === 'CANCELLED') {
    throw new APIError('Cannot update a cancelled order', 400);
  }

  return await db.sequelize.transaction(async (t) => {
    await order.update({ status, updated_by: adminId }, { transaction: t });

    await db.OrderStatusHistory.create({
      order_id: order.id,
      status,
      remarks: `Status updated to ${status} by admin`,
      changed_by: adminId
    }, { transaction: t });

    return order;
  });
};

export const cancelOrder = async (userId, userRole, orderId) => {
  const order = await db.Order.findByPk(orderId);
  if (!order) throw new APIError('Order not found', 404);

  if (userRole !== 'ADMIN' && parseInt(order.customer_id, 10) !== parseInt(userId, 10)) {
    throw new APIError('Access denied', 403);
  }

  if (!['DRAFT', 'PENDING_PAYMENT'].includes(order.status) && userRole !== 'ADMIN') {
    throw new APIError('Order cannot be cancelled at this stage', 400);
  }

  if (order.status === 'CANCELLED') {
    return order;
  }

  return await db.sequelize.transaction(async (t) => {
    await order.update({ status: 'CANCELLED', updated_by: userId }, { transaction: t });

    await db.OrderStatusHistory.create({
      order_id: order.id,
      status: 'CANCELLED',
      remarks: 'Order cancelled by user',
      changed_by: userId
    }, { transaction: t });

    return order;
  });
};

export default {
  createOrder,
  listOrders,
  getOrderDetails,
  updateOrderStatus,
  cancelOrder
};
