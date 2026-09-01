import sequelize from '../config/db.js';

// --- Import all models ---
import { User } from './user.model.js';
import { CustomerProfile } from './customer-profile.model.js';
import { RefreshToken } from './refresh-token.model.js';
import { PasswordResetToken } from './password-reset-token.model.js';
import { CustomerAddress } from './customer-address.model.js';
import { School } from './school.model.js';
import { Category } from './category.model.js';
import { Uniform } from './uniform.model.js';
import { UniformSchoolMapping } from './uniform-school-mapping.model.js';
import { UniformVariant } from './uniform-variant.model.js';
import { Media } from './media.model.js';
import { Cart } from './cart.model.js';
import { CartItem } from './cart-item.model.js';
import { Order } from './order.model.js';
import { OrderItem } from './order-item.model.js';
import { OrderCustomer } from './order-customer.model.js';
import { OrderAddress } from './order-address.model.js';
import { OrderSchoolSnapshot } from './order-school-snapshot.model.js';
import { Payment } from './payment.model.js';
import { PaymentTransaction } from './payment-transaction.model.js';
import { Delivery } from './delivery.model.js';
import { DeliveryStatusHistory } from './delivery-status-history.model.js';
import { OrderStatusHistory } from './order-status-history.model.js';
import { AuditLog } from './audit-log.model.js';

// ─────────────────────────────────────────
// Associations
// ─────────────────────────────────────────

// User ↔ CustomerProfile (1:1)
User.hasOne(CustomerProfile, { foreignKey: 'user_id', onDelete: 'RESTRICT' });
CustomerProfile.belongsTo(User, { foreignKey: 'user_id' });

// User ↔ RefreshToken (1:N)
User.hasMany(RefreshToken, { foreignKey: 'user_id', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

// User ↔ PasswordResetToken (1:N)
User.hasMany(PasswordResetToken, { foreignKey: 'user_id', onDelete: 'CASCADE' });
PasswordResetToken.belongsTo(User, { foreignKey: 'user_id' });

// User ↔ CustomerAddress (1:N)
User.hasMany(CustomerAddress, { foreignKey: 'user_id', onDelete: 'RESTRICT' });
CustomerAddress.belongsTo(User, { foreignKey: 'user_id' });

// User ↔ AuditLog (1:N)
User.hasMany(AuditLog, { foreignKey: 'user_id', onDelete: 'SET NULL' });
AuditLog.belongsTo(User, { foreignKey: 'user_id' });

// Category ↔ Uniform (1:N)
Category.hasMany(Uniform, { foreignKey: 'category_id', onDelete: 'RESTRICT' });
Uniform.belongsTo(Category, { foreignKey: 'category_id' });

// Uniform ↔ UniformVariant (1:N)
Uniform.hasMany(UniformVariant, { foreignKey: 'uniform_id', onDelete: 'CASCADE' });
UniformVariant.belongsTo(Uniform, { foreignKey: 'uniform_id' });

// School ↔ UniformSchoolMapping (1:N)
School.hasMany(UniformSchoolMapping, { foreignKey: 'school_id', onDelete: 'CASCADE' });
UniformSchoolMapping.belongsTo(School, { foreignKey: 'school_id' });

// Uniform ↔ UniformSchoolMapping (1:N)
Uniform.hasMany(UniformSchoolMapping, { foreignKey: 'uniform_id', onDelete: 'CASCADE' });
UniformSchoolMapping.belongsTo(Uniform, { foreignKey: 'uniform_id' });

// School ↔ Uniform (N:M via UniformSchoolMapping)
School.belongsToMany(Uniform, { through: UniformSchoolMapping, foreignKey: 'school_id', otherKey: 'uniform_id' });
Uniform.belongsToMany(School, { through: UniformSchoolMapping, foreignKey: 'uniform_id', otherKey: 'school_id' });

// User ↔ Cart (1:N)
User.hasMany(Cart, { foreignKey: 'user_id', onDelete: 'RESTRICT' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

// School ↔ Cart (1:N)
School.hasMany(Cart, { foreignKey: 'school_id', onDelete: 'RESTRICT' });
Cart.belongsTo(School, { foreignKey: 'school_id' });

// Cart ↔ CartItem (1:N)
Cart.hasMany(CartItem, { foreignKey: 'cart_id', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

// UniformVariant ↔ CartItem (1:N)
UniformVariant.hasMany(CartItem, { foreignKey: 'variant_id', onDelete: 'RESTRICT' });
CartItem.belongsTo(UniformVariant, { foreignKey: 'variant_id' });

// User ↔ Order (1:N — as customer)
User.hasMany(Order, { foreignKey: 'customer_id', onDelete: 'RESTRICT' });
Order.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' });

// School ↔ Order (1:N)
School.hasMany(Order, { foreignKey: 'school_id', onDelete: 'RESTRICT' });
Order.belongsTo(School, { foreignKey: 'school_id' });

// Order ↔ OrderItem (1:N)
Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// Uniform ↔ OrderItem (1:N)
Uniform.hasMany(OrderItem, { foreignKey: 'uniform_id', onDelete: 'RESTRICT' });
OrderItem.belongsTo(Uniform, { foreignKey: 'uniform_id' });

// UniformVariant ↔ OrderItem (1:N)
UniformVariant.hasMany(OrderItem, { foreignKey: 'variant_id', onDelete: 'RESTRICT' });
OrderItem.belongsTo(UniformVariant, { foreignKey: 'variant_id' });

// Order ↔ OrderCustomer (1:1 snapshot)
Order.hasOne(OrderCustomer, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderCustomer.belongsTo(Order, { foreignKey: 'order_id' });

// Order ↔ OrderAddress (1:1 snapshot)
Order.hasOne(OrderAddress, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderAddress.belongsTo(Order, { foreignKey: 'order_id' });

// Order ↔ OrderSchoolSnapshot (1:1 snapshot)
Order.hasOne(OrderSchoolSnapshot, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderSchoolSnapshot.belongsTo(Order, { foreignKey: 'order_id' });

// Order ↔ Payment (1:1)
Order.hasOne(Payment, { foreignKey: 'order_id', onDelete: 'CASCADE' });
Payment.belongsTo(Order, { foreignKey: 'order_id' });

// Payment ↔ PaymentTransaction (1:N)
Payment.hasMany(PaymentTransaction, { foreignKey: 'payment_id', onDelete: 'CASCADE' });
PaymentTransaction.belongsTo(Payment, { foreignKey: 'payment_id' });

// Order ↔ Delivery (1:1)
Order.hasOne(Delivery, { foreignKey: 'order_id', onDelete: 'CASCADE' });
Delivery.belongsTo(Order, { foreignKey: 'order_id' });

// Delivery ↔ DeliveryStatusHistory (1:N)
Delivery.hasMany(DeliveryStatusHistory, { foreignKey: 'delivery_id', onDelete: 'CASCADE' });
DeliveryStatusHistory.belongsTo(Delivery, { foreignKey: 'delivery_id' });

// User ↔ DeliveryStatusHistory (1:N — changed_by)
User.hasMany(DeliveryStatusHistory, { foreignKey: 'changed_by', onDelete: 'SET NULL' });
DeliveryStatusHistory.belongsTo(User, { foreignKey: 'changed_by', as: 'changedBy' });

// Order ↔ OrderStatusHistory (1:N)
Order.hasMany(OrderStatusHistory, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderStatusHistory.belongsTo(Order, { foreignKey: 'order_id' });

// User ↔ OrderStatusHistory (1:N — changed_by)
User.hasMany(OrderStatusHistory, { foreignKey: 'changed_by', onDelete: 'SET NULL' });
OrderStatusHistory.belongsTo(User, { foreignKey: 'changed_by', as: 'changedBy' });

// ─────────────────────────────────────────
// db registry
// ─────────────────────────────────────────
const db = {
  sequelize,
  User,
  CustomerProfile,
  RefreshToken,
  PasswordResetToken,
  CustomerAddress,
  School,
  Category,
  Uniform,
  UniformSchoolMapping,
  UniformVariant,
  Media,
  Cart,
  CartItem,
  Order,
  OrderItem,
  OrderCustomer,
  OrderAddress,
  OrderSchoolSnapshot,
  Payment,
  PaymentTransaction,
  Delivery,
  DeliveryStatusHistory,
  OrderStatusHistory,
  AuditLog
};

export default db;
