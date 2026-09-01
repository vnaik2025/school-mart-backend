# SCHOOL ACCESSORIES MART – FEATURES

## Project Overview

School Accessories Mart is a production-grade backend platform for managing school-specific uniform ordering.

The platform enables administrators to onboard schools, configure uniform catalogs, manage customers, process orders, simulate payments, and provide delivery tracking through third-party logistics providers.

The system is designed using modular architecture, scalable REST APIs, clean service boundaries, and future extensibility for payment gateways, inventory management, notifications, analytics, and ERP integrations.

---

# System Roles

## Admin

The Admin has complete access to the system.

### Responsibilities

- Manage schools
- Manage uniform catalog
- Manage categories
- Manage variants
- Manage pricing
- Manage customers
- Manage orders
- Manage payment records
- Manage delivery tracking
- Manage media
- View audit logs

---

## Customer

A Customer represents the parent or guardian placing uniform orders.

Students are **not separate system users**. Student information is stored within customer profiles and orders.

### Responsibilities

- Register/Login
- Manage profile
- Manage addresses
- Select school
- Browse uniforms
- Add products to cart
- Place orders
- Track orders
- Cancel eligible orders
- View order history

---

# Functional Modules

---

# 1. Authentication Module

## Customer Authentication

- Customer Registration
- Customer Login
- Logout
- JWT Authentication
- Refresh Token Authentication
- Forgot Password
- Reset Password
- Change Password

## Admin Authentication

- Secure Admin Login
- JWT Authentication
- Refresh Token Authentication

## Authorization

Role-Based Access Control (RBAC)

Supported Roles

- Admin
- Customer

---

# 2. Customer Management

## Admin Features

- View all customers
- Search customers
- Filter customers
- View customer profile
- View customer order history
- Activate customer account
- Deactivate customer account

## Customer Features

- Update profile
- Update phone number
- Update email
- Manage delivery addresses
- View account information

---

# 3. School Management

Purpose:

Maintain all onboarded schools.

## Admin Features

- Create school
- Update school
- Soft delete school
- Activate school
- Deactivate school
- View school details
- Search schools
- List schools

## School Information

- School Name
- Logo
- Address
- Contact Number
- Email
- Status
- Display Order

## Customer Features

- View active schools
- Search schools
- Select school

---

# 4. Uniform Catalog Management

Purpose:

Manage school-specific uniform catalogs.

---

## Category Management

Admin can

- Create category
- Update category
- Delete category
- Activate category
- Deactivate category

Example Categories

- Shirt
- Pant
- Skirt
- Tie
- Belt
- Shoes
- Socks
- Sweater
- Blazer

---

## Uniform Management

Admin can

- Create uniform
- Update uniform
- Delete uniform
- Upload images
- Configure pricing
- Configure display order
- Add description
- Configure SKU
- Activate uniform
- Deactivate uniform

---

## School Mapping

- Assign uniforms to schools
- Remove uniforms from schools
- Enable/Disable school-specific products

---

## Variant Management

Each uniform supports multiple variants.

Variant Properties

- Size
- Gender
- Price
- Quantity Requirement
- Status
- Display Order

Example

Shirt

- Size 28
- Size 30
- Size 32
- Size 34

Every variant maintains independent pricing.

---

## Customer Features

- Browse uniforms
- View product details
- View multiple images
- Select size
- Select quantity
- View pricing

---

# 5. Cart Module

Each customer owns a single active cart.

## Features

- Add item
- Update quantity
- Remove item
- Clear cart
- View cart
- View cart summary

## Cart Validation

- School validation
- Variant validation
- Quantity validation

## Cart Calculations

- Item subtotal
- Total quantity
- Grand total

---

# 6. Order Management

Orders are created only from the active cart.

## Order Workflow

```
Draft
    ↓
Pending Payment
    ↓
Confirmed
    ↓
Received
    ↓
Preparing for Dispatch
    ↓
Dispatched
    ↓
Delivered

OR

Cancelled
```

---

## Customer Features

- Place order
- View order summary
- View order details
- View order history
- Cancel order before dispatch

---

## Admin Features

- View all orders
- Search orders
- Filter orders
- View order details
- Update order status
- Cancel orders
- Mark order as received
- Mark order as preparing
- Mark order as dispatched
- Mark order as delivered

---

## Order Information

Each order stores

- Order Number
- Customer Information
- Student Information
- Delivery Address
- School
- Ordered Items
- Selected Variants
- Pricing Snapshot
- Payment Snapshot
- Delivery Details
- Status History
- Created At
- Updated At

---

# 7. Payment Simulation Module

Version 1 does **not** integrate with a real payment gateway.

The application must use a Payment Service abstraction so that Razorpay or Stripe can be integrated later without changing business logic.

## Features

### Simulated Checkout

Create a simulated payment session before confirming an order.

### Simulation Results

- Success
- Failed
- Cancelled

### Payment Record

Store

- Transaction ID (UUID)
- Payment Method = SIMULATED
- Payment Status
- Amount
- Timestamp

### Admin Simulation Mode

- Always Success
- Always Fail
- Random Result

### Order Confirmation

Only successful simulated payments

- Confirm the order
- Generate Order Number
- Generate Payment Receipt

Failed payments keep the order in **Pending Payment** status.

---

# 8. Delivery Tracking

Delivery is handled outside the application.

The platform stores tracking information only.

## Admin Features

- Add courier name
- Add tracking number
- Generate tracking URL
- Update delivery status
- Mark order delivered

## Customer Features

- View delivery status
- Open tracking link
- View delivery timeline

## Delivery Workflow

```
Preparing
    ↓
Packed
    ↓
Dispatched
    ↓
In Transit
    ↓
Out For Delivery
    ↓
Delivered
```

---

# 9. Search & Filtering

## Customer

- Search schools
- Search uniforms

## Admin

- Search schools
- Search customers
- Search uniforms
- Search orders

## Filters

- School
- Category
- Status
- Customer
- Date

---

# 10. Media Management

All uniform images are stored in **Amazon S3**.

## Features

- Upload multiple images
- Thumbnail image support
- Image ordering
- Replace images
- Delete images
- Soft delete image records
- Store S3 Object Key
- Store S3 URL
- Validate image size
- Validate image type

## Supported Formats

- JPG
- JPEG
- PNG
- WEBP

## Storage Structure

```
uniforms/
    {schoolId}/
        {uniformId}/
            image-1.jpg
            image-2.jpg
```

## Future Ready

- CloudFront CDN
- Signed URLs
- Image optimization
- Image compression
- Versioned uploads

---

# 11. File Storage

The application uses **Amazon S3** as the primary object storage service.

Requirements

- Upload images directly to S3
- Store only metadata in the database
- Delete S3 objects when images are removed
- Support configurable bucket names
- Support configurable AWS region
- Generate unique object keys
- Storage implementation must be abstracted behind a Storage Service

---

# 12. Audit Logging

Track important system activities.

Examples

- Login
- Logout
- School Created
- School Updated
- Uniform Created
- Uniform Updated
- Customer Updated
- Order Created
- Order Cancelled
- Payment Simulated
- Delivery Updated

---

# Non-Functional Requirements

## Security

- JWT Authentication
- Refresh Tokens
- Role-Based Authorization
- Password Hashing (bcrypt)
- Request Validation
- SQL Injection Protection
- XSS Protection
- CORS Configuration
- Rate Limiting
- Environment Variable Management

---

## Performance

- Pagination
- Sorting
- Filtering
- Optimized Database Queries
- Database Indexing
- S3 Object Storage
- CDN Ready
- Lazy Image Loading

---

## Scalability

Architecture should support future integration with

- Razorpay
- Stripe
- Inventory Management
- Email Notifications
- SMS Notifications
- WhatsApp Notifications
- ERP Integration
- Coupons & Discounts
- Multiple Delivery Partners
- Analytics
- Multi-language Support

---

## API Standards

- RESTful APIs
- Versioned APIs (`/api/v1`)
- Standard HTTP Status Codes
- Standard API Response Structure
- Request Validation
- Centralized Error Handling
- Request ID for tracing

---

# Suggested Core Entities

## User

- id
- role
- name
- email
- phone
- password
- status

## CustomerAddress

- id
- customerId
- addressLine1
- addressLine2
- city
- state
- postalCode
- country

## School

- id
- name
- logo
- address
- contactNumber
- status

## Category

- id
- name
- description
- status

## Uniform

- id
- categoryId
- schoolId
- sku
- name
- description
- status

## UniformVariant

- id
- uniformId
- size
- gender
- price
- quantityRequirement
- status

## UniformImage

- id
- uniformId
- s3Key
- imageUrl
- isThumbnail
- displayOrder

## Cart

- id
- customerId

## CartItem

- id
- cartId
- variantId
- quantity

## Order

- id
- orderNumber
- customerId
- schoolId
- paymentId
- addressId
- totalAmount
- status

## OrderItem

- id
- orderId
- variantId
- quantity
- price

## Payment

- id
- transactionId
- method
- status
- amount

## Delivery

- id
- orderId
- courierName
- trackingNumber
- trackingUrl
- deliveryStatus

## AuditLog

- id
- userId
- action
- entity
- entityId
- metadata
- timestamp

---

# Out of Scope

- Real Payment Gateway Integration
- Native Android Application
- Native iOS Application
- Manufacturing Workflow
- Production Tracking
- Raw Material Inventory
- Returns & Refunds
- Exchange Management
- School Admin Portal
- Analytics Dashboard
- ERP Integration
- Email Notifications
- SMS Notifications
- WhatsApp Notifications
