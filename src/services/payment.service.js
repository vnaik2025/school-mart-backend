import db from '../models/index.js';
import { APIError } from '../utils/api-error.js';

export const simulatePayment = async (userId, orderId, outcome) => {
  const order = await db.Order.findOne({
    where: { id: orderId, customer_id: userId }
  });

  if (!order) {
    throw new APIError('Order not found', 404);
  }

  if (order.status !== 'PENDING_PAYMENT') {
    throw new APIError(`Payment cannot be processed. Order status is ${order.status}`, 400);
  }

  return await db.sequelize.transaction(async (t) => {
    // 1. Ensure Payment record exists
    let payment = await db.Payment.findOne({
      where: { order_id: order.id },
      transaction: t
    });

    if (!payment) {
      payment = await db.Payment.create({
        order_id: order.id,
        payment_method: 'SIMULATED',
        amount: order.grand_total,
        status: 'PENDING'
      }, { transaction: t });
    }

    // 2. Determine Outcome Status
    const isSuccess = outcome.toUpperCase() === 'SUCCESS';
    const finalStatus = isSuccess ? 'SUCCESS' : 'FAILED';

    // 3. Create PaymentTransaction log
    await db.PaymentTransaction.create({
      payment_id: payment.id,
      status: finalStatus,
      gateway: 'SIMULATED',
      gateway_response: { simulated_outcome: outcome, timestamp: new Date() },
      remarks: `Simulated payment ${finalStatus.toLowerCase()}`,
      processed_at: new Date()
    }, { transaction: t });

    // 4. Update Payment record
    await payment.update({
      status: finalStatus,
      paid_at: isSuccess ? new Date() : null,
      gateway_reference: isSuccess ? `SIM-${Date.now()}` : null
    }, { transaction: t });

    // 5. Sync Order Status
    if (isSuccess) {
      await order.update({ status: 'CONFIRMED', updated_by: userId }, { transaction: t });

      await db.OrderStatusHistory.create({
        order_id: order.id,
        status: 'CONFIRMED',
        remarks: 'Payment successful',
        changed_by: userId
      }, { transaction: t });
    }
    // If failed, we keep it as PENDING_PAYMENT for retry.

    return {
      payment,
      order_status: order.status
    };
  });
};

export const getPaymentDetails = async (userId, userRole, orderId) => {
  // First, verify access to the order
  const order = await db.Order.findByPk(orderId);
  
  if (!order) {
    throw new APIError('Order not found', 404);
  }

  if (userRole !== 'ADMIN' && parseInt(order.customer_id, 10) !== parseInt(userId, 10)) {
    throw new APIError('Access denied', 403);
  }

  const payment = await db.Payment.findOne({
    where: { order_id: orderId },
    include: [{ model: db.PaymentTransaction, order: [['processed_at', 'DESC']] }]
  });

  if (!payment) {
    throw new APIError('No payment record found for this order', 404);
  }

  return payment;
};

export default {
  simulatePayment,
  getPaymentDetails
};
