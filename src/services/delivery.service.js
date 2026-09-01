import db from '../models/index.js';
import { APIError } from '../utils/api-error.js';

export const createDelivery = async (orderId, adminId, trackingData = {}) => {
  const order = await db.Order.findByPk(orderId);

  if (!order) {
    throw new APIError('Order not found', 404);
  }

  if (['DRAFT', 'PENDING_PAYMENT', 'CANCELLED'].includes(order.status)) {
    throw new APIError(`Cannot initiate delivery for an order with status ${order.status}`, 400);
  }

  return await db.sequelize.transaction(async (t) => {
    let delivery = await db.Delivery.findOne({
      where: { order_id: order.id },
      transaction: t
    });

    if (delivery) {
      throw new APIError('Delivery record already exists for this order', 400);
    }

    delivery = await db.Delivery.create({
      order_id: order.id,
      courier_name: trackingData.courier_name || null,
      tracking_number: trackingData.tracking_number || null,
      tracking_url: trackingData.tracking_url || null,
      current_status: 'PREPARING'
    }, { transaction: t });

    await db.DeliveryStatusHistory.create({
      delivery_id: delivery.id,
      status: 'PREPARING',
      remarks: 'Delivery initiated and is being prepared',
      changed_by: adminId
    }, { transaction: t });

    // Sync Order Status
    if (order.status !== 'PREPARING_FOR_DISPATCH') {
      await order.update({ status: 'PREPARING_FOR_DISPATCH', updated_by: adminId }, { transaction: t });

      await db.OrderStatusHistory.create({
        order_id: order.id,
        status: 'PREPARING_FOR_DISPATCH',
        remarks: 'Order is being prepared for dispatch',
        changed_by: adminId
      }, { transaction: t });
    }

    return delivery;
  });
};

export const updateDeliveryStatus = async (orderId, status, trackingData, adminId) => {
  const order = await db.Order.findByPk(orderId);
  if (!order) throw new APIError('Order not found', 404);

  return await db.sequelize.transaction(async (t) => {
    const delivery = await db.Delivery.findOne({
      where: { order_id: order.id },
      transaction: t
    });

    if (!delivery) {
      throw new APIError('Delivery record not found', 404);
    }

    const updates = { current_status: status };
    if (trackingData.courier_name) updates.courier_name = trackingData.courier_name;
    if (trackingData.tracking_number) updates.tracking_number = trackingData.tracking_number;
    if (trackingData.tracking_url) updates.tracking_url = trackingData.tracking_url;

    if (status === 'DELIVERED') {
      updates.delivered_at = new Date();
    }

    await delivery.update(updates, { transaction: t });

    await db.DeliveryStatusHistory.create({
      delivery_id: delivery.id,
      status,
      remarks: trackingData.remarks || `Delivery status updated to ${status}`,
      changed_by: adminId
    }, { transaction: t });

    // Sync Order Status
    let orderStatusUpdate = null;
    if (status === 'DISPATCHED') orderStatusUpdate = 'DISPATCHED';
    if (status === 'DELIVERED') orderStatusUpdate = 'DELIVERED';

    if (orderStatusUpdate && order.status !== orderStatusUpdate) {
      await order.update({ status: orderStatusUpdate, updated_by: adminId }, { transaction: t });

      await db.OrderStatusHistory.create({
        order_id: order.id,
        status: orderStatusUpdate,
        remarks: `Order status synced from delivery milestone (${status})`,
        changed_by: adminId
      }, { transaction: t });
    }

    return delivery;
  });
};

export const getDeliveryDetails = async (userId, userRole, orderId) => {
  const order = await db.Order.findByPk(orderId);
  
  if (!order) {
    throw new APIError('Order not found', 404);
  }

  if (userRole !== 'ADMIN' && parseInt(order.customer_id, 10) !== parseInt(userId, 10)) {
    throw new APIError('Access denied', 403);
  }

  const delivery = await db.Delivery.findOne({
    where: { order_id: orderId },
    include: [{ model: db.DeliveryStatusHistory, order: [['created_at', 'DESC']] }]
  });

  if (!delivery) {
    throw new APIError('No delivery record found for this order', 404);
  }

  return delivery;
};

export default {
  createDelivery,
  updateDeliveryStatus,
  getDeliveryDetails
};
