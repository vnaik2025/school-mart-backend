# ROUTES_AND_BUSINESSLOGIC

# Base URL

/api/v1

---

# Authentication Module

## POST /auth/register

Access: Public

Business Logic

- Register customer
- Hash password
- Validate email uniqueness
- Validate phone uniqueness
- Create customer
- Generate JWT
- Generate Refresh Token

---

## POST /auth/login

Access: Public

Business Logic

- Validate credentials
- Verify password
- Generate JWT
- Generate Refresh Token

---

## POST /auth/refresh-token

Access: Public

Business Logic

- Validate refresh token
- Generate new JWT

---

## POST /auth/logout

Access: Authenticated

Business Logic

- Invalidate refresh token

---

## POST /auth/forgot-password

Access: Public

Business Logic

- Generate reset token
- Store token
- (Future) Send email

---

## POST /auth/reset-password

Access: Public

Business Logic

- Validate reset token
- Update password
- Remove reset token

---

## POST /auth/change-password

Access: Authenticated

Business Logic

- Verify current password
- Update password

---

# Customer Module

## GET /customers/profile

Access: Customer

Business Logic

- Return logged in customer profile

---

## PUT /customers/profile

Access: Customer

Business Logic

- Update profile

---

## POST /customers/list?page=1&limit=10

Access: Admin

Business Logic

- List customers
- Support search
- Support filters

---

## GET /customers/:id

Access: Admin

Business Logic

- View customer details

---

## PUT /customers/:id/status

Access: Admin

Business Logic

- Activate customer
- Deactivate customer

---

# Address Module

## POST /addresses

Access: Customer

Business Logic

- Create delivery address

---

## GET /addresses

Access: Customer

Business Logic

- List customer addresses

---

## PUT /addresses/:id

Access: Customer

Business Logic

- Update address

---

## DELETE /addresses/:id

Access: Customer

Business Logic

- Soft delete address

---

# School Module

## POST /schools

Access: Admin

Business Logic

- Create school

---

## POST /schools/list?page=1&limit=10

Access: Authenticated

Business Logic

- List schools
- Search
- Filter
- Pagination

---

## GET /schools/:id

Access: Authenticated

Business Logic

- Get school details

---

## PUT /schools/:id

Access: Admin

Business Logic

- Update school

---

## DELETE /schools/:id

Access: Admin

Business Logic

- Soft delete school

---

## PUT /schools/:id/status

Access: Admin

Business Logic

- Activate school
- Deactivate school

---

# Category Module

## POST /categories

Access: Admin

Business Logic

- Create category

---

## POST /categories/list?page=1&limit=10

Access: Authenticated

Business Logic

- List categories

---

## GET /categories/:id

Access: Authenticated

Business Logic

- Get category

---

## PUT /categories/:id

Access: Admin

Business Logic

- Update category

---

## DELETE /categories/:id

Access: Admin

Business Logic

- Soft delete category

---

# Uniform Module

## POST /uniforms

Access: Admin

Business Logic

- Create uniform
- Map category
- Map school

---

## POST /uniforms/list?page=1&limit=10

Access: Authenticated

Business Logic

- List uniforms
- Search
- Filter
- Pagination

---

## GET /uniforms/:id

Access: Authenticated

Business Logic

- Get complete uniform details
- Include variants
- Include images

---

## PUT /uniforms/:id

Access: Admin

Business Logic

- Update uniform

---

## DELETE /uniforms/:id

Access: Admin

Business Logic

- Soft delete uniform

---

# Uniform Variant Module

## POST /uniform-variants

Access: Admin

Business Logic

- Create variant

---

## PUT /uniform-variants/:id

Access: Admin

Business Logic

- Update variant

---

## DELETE /uniform-variants/:id

Access: Admin

Business Logic

- Soft delete variant

---

# Uniform Image Module

## POST /uniform-images

Access: Admin

Business Logic

- Upload image to Amazon S3
- Save image metadata
- Associate image with uniform

---

## DELETE /uniform-images/:id

Access: Admin

Business Logic

- Delete object from S3
- Soft delete metadata

---

## PUT /uniform-images/:id/thumbnail

Access: Admin

Business Logic

- Set thumbnail image

---

# Cart Module

## POST /cart/items

Access: Customer

Business Logic

- Validate school
- Validate variant
- Add item
- Create cart if missing

---

## GET /cart

Access: Customer

Business Logic

- Return active cart
- Calculate totals

---

## PUT /cart/items/:id

Access: Customer

Business Logic

- Update quantity

---

## DELETE /cart/items/:id

Access: Customer

Business Logic

- Remove item

---

## DELETE /cart

Access: Customer

Business Logic

- Clear cart

---

# Order Module

## POST /orders

Access: Customer

Business Logic

- Validate cart
- Create order
- Generate order number
- Create payment session
- Copy pricing snapshot

---

## POST /orders/list?page=1&limit=10

Access: Authenticated

Business Logic

- Customer sees own orders
- Admin sees all orders
- Search
- Filter

---

## GET /orders/:id

Access: Authenticated

Business Logic

- Return complete order details

---

## PUT /orders/:id/status

Access: Admin

Business Logic

- Update order workflow
- Validate status transition

---

## DELETE /orders/:id

Access: Customer/Admin

Business Logic

- Cancel order
- Validate cancellation rules

---

# Payment Module

## POST /payments/:orderId/simulate

Access: Customer

Business Logic

- Simulate payment
- Success
- Failure
- Cancelled

---

## GET /payments/:orderId

Access: Authenticated

Business Logic

- View payment details

---

# Delivery Module

## POST /deliveries/:orderId

Access: Admin

Business Logic

- Create delivery record
- Generate tracking URL

---

## PUT /deliveries/:orderId

Access: Admin

Business Logic

- Update delivery status
- Update tracking information

---

## GET /deliveries/:orderId

Access: Authenticated

Business Logic

- Return tracking information

---

# Media Module

## POST /media/upload

Access: Admin

Business Logic

- Validate image
- Upload to Amazon S3
- Return image metadata

---

# Audit Module

## POST /audit/list?page=1&limit=10

Access: Admin

Business Logic

- List audit logs
- Filter logs
- Search logs

---

# GLOBAL BUSINESS RULES

## Pagination

Allowed Query Parameters

- page
- limit

Everything else must be passed in the request body.

---

## Request Body

Supported

- filters
- search
- sort
- advanced filters
- date ranges
- status

---

## Soft Delete

Never physically delete records.

Use

```
isArchived = true
archivedAt = timestamp
archivedBy = userId
```

---

## Transactions

Database transactions are mandatory for

- Order Creation
- Payment Processing
- Cart Checkout
- Uniform Creation with Variants
- Image Upload Metadata
- Delivery Creation

---

## Image Upload

- Images stored in Amazon S3
- Store only S3 Key and URL in database
- Delete S3 object on image removal

---

## Authentication

Protected APIs require

```
Authorization: Bearer <JWT>
```

---

## API Response Structure

Success

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "rid": "<request-id>",
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "Validation failed",
  "rid": "<request-id>",
  "errors": []
}
```
