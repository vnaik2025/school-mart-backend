import db from '../models/index.js';
import { Op } from 'sequelize';

export const getDashboardStats = async () => {
  // 1. Total Customers
  const totalCustomers = await db.User.count({ where: { role: 'CUSTOMER', status: 'ACTIVE' } });

  // 2. Total Schools
  const totalSchools = await db.School.count({ where: { status: 'ACTIVE', is_archive: false } });

  // 3. Total Active Products (Variants)
  const totalProducts = await db.UniformVariant.count({ where: { status: 'ACTIVE', is_archive: false } });

  // 4. Total Revenue (SUM of SUCCESS payments)
  const revenueResult = await db.Payment.sum('amount', { where: { status: 'SUCCESS' } });
  const totalRevenue = revenueResult || 0;

  // 5. Total Orders grouped by status
  const ordersGrouped = await db.Order.findAll({
    attributes: ['status', [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']],
    group: ['status'],
    raw: true
  });

  const orderStats = ordersGrouped.reduce((acc, row) => {
    acc[row.status] = parseInt(row.count, 10);
    return acc;
  }, {});

  const totalOrders = Object.values(orderStats).reduce((a, b) => a + b, 0);

  return {
    totalCustomers,
    totalSchools,
    totalProducts,
    totalRevenue: parseFloat(totalRevenue),
    totalOrders,
    orderStats
  };
};

export const getRecentActivities = async () => {
  const recentOrders = await db.Order.findAll({
    limit: 5,
    order: [['created_at', 'DESC']],
    include: [{ model: db.OrderCustomer, attributes: ['customer_name'] }]
  });

  const recentPayments = await db.Payment.findAll({
    limit: 5,
    order: [['created_at', 'DESC']],
    include: [{ model: db.Order, attributes: ['order_number'] }]
  });

  const recentDeliveries = await db.Delivery.findAll({
    limit: 5,
    order: [['created_at', 'DESC']],
    include: [{ model: db.Order, attributes: ['order_number'] }]
  });

  const activities = [
    ...recentOrders.map(o => ({
      id: `ord_${o.id}`,
      type: 'ORDER',
      description: `New order ${o.order_number} placed`,
      timestamp: o.created_at
    })),
    ...recentPayments.map(p => ({
      id: `pay_${p.id}`,
      type: 'PAYMENT',
      description: `Payment of ${p.amount} received`,
      timestamp: p.created_at
    })),
    ...recentDeliveries.map(d => ({
      id: `del_${d.id}`,
      type: 'DELIVERY',
      description: `Delivery status updated to ${d.delivery_status}`,
      timestamp: d.created_at
    }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 15);

  return activities;
};

export default {
  getDashboardStats,
  getRecentActivities
};
