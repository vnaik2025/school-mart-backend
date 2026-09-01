# SCHOOL ACCESSORIES MART – DATABASE SCHEMA

Database

- PostgreSQL

ORM

- Sequelize ORM

Architecture

- Clean Architecture
- Service Layer
- Repository Pattern (Future Ready)

---

# DATABASE DESIGN PRINCIPLES

This schema is the single source of truth for the backend.

It follows

- AGENT.md
- ARCHITECTURE.md
- FEATURE.md
- ROUTES_AND_BUSINESS_LOGIC.md
- S3_SKILL.md

---

# DATABASE STANDARDS

Primary Keys

- BIGSERIAL

Foreign Keys

- BIGINT

Money

- DECIMAL(12,2)

Date & Time

- TIMESTAMP

Large JSON Data

- JSONB

Strings

- VARCHAR

Descriptions

- TEXT

---

# NAMING CONVENTIONS

Database

snake_case

Example

customer_profiles

order_status_history

payment_transactions

---

Sequelize Models

PascalCase

Example

CustomerProfile

OrderStatusHistory

PaymentTransaction

---

JavaScript Variables

camelCase

Example

customerProfile

paymentTransaction

---

# BASE ENTITY

Every core entity inherits the following columns.

| Column      | Type           | Description        |
| ----------- | -------------- | ------------------ |
| id          | BIGSERIAL      | Primary Key        |
| created_at  | TIMESTAMP      | Creation Timestamp |
| updated_at  | TIMESTAMP      | Update Timestamp   |
| created_by  | BIGINT NULL    | User Reference     |
| updated_by  | BIGINT NULL    | User Reference     |
| is_archive  | BOOLEAN        | Soft Delete Flag   |
| archived_at | TIMESTAMP NULL | Archive Timestamp  |
| archived_by | BIGINT NULL    | User Reference     |

Default

is_archive = false

---

# SOFT DELETE RULES

Core tables are never physically deleted.

Instead use

is_archive = true

archived_at = CURRENT_TIMESTAMP

archived_by = userId

Archived records

- Hidden from APIs
- Excluded from searches
- Excluded from customer listings

---

# ENUMS

## UserRole

ADMIN

CUSTOMER

---

## UserStatus

ACTIVE

INACTIVE

---

## Gender

MALE

FEMALE

UNISEX

---

## SchoolStatus

ACTIVE

INACTIVE

---

## CategoryStatus

ACTIVE

INACTIVE

---

## UniformStatus

ACTIVE

INACTIVE

---

## VariantStatus

ACTIVE

INACTIVE

---

## CartStatus

ACTIVE

CHECKED_OUT

ABANDONED

---

## OrderStatus

DRAFT

PENDING_PAYMENT

CONFIRMED

RECEIVED

PREPARING_FOR_DISPATCH

DISPATCHED

DELIVERED

CANCELLED

---

## PaymentStatus

PENDING

SUCCESS

FAILED

CANCELLED

REFUNDED

(Future)

---

## PaymentMethod

SIMULATED

RAZORPAY

STRIPE

(Future)

---

## DeliveryStatus

PREPARING

PACKED

DISPATCHED

IN_TRANSIT

OUT_FOR_DELIVERY

DELIVERED

---

## MediaEntityType

UNIFORM

SCHOOL

USER

CATEGORY

(Future Ready)

---

## AuditEntity

USER

CUSTOMER_PROFILE

ADDRESS

SCHOOL

CATEGORY

UNIFORM

VARIANT

MEDIA

CART

ORDER

PAYMENT

DELIVERY

AUTH

---

# TABLE : users

Purpose

Stores authentication information only.

Customer-specific profile information is stored in
customer_profiles.

Admin users also use this table.

---

Columns

| Column         | Type         | Constraints     |
| -------------- | ------------ | --------------- |
| id             | BIGSERIAL    | PK              |
| role           | UserRole     | NOT NULL        |
| email          | VARCHAR(255) | UNIQUE NOT NULL |
| phone          | VARCHAR(20)  | UNIQUE NOT NULL |
| password       | VARCHAR(255) | NOT NULL        |
| status         | UserStatus   | DEFAULT ACTIVE  |
| email_verified | BOOLEAN      | DEFAULT FALSE   |
| phone_verified | BOOLEAN      | DEFAULT FALSE   |
| last_login_at  | TIMESTAMP    | NULL            |
| created_at     | TIMESTAMP    | NOT NULL        |
| updated_at     | TIMESTAMP    | NOT NULL        |
| created_by     | BIGINT       | NULL            |
| updated_by     | BIGINT       | NULL            |
| is_archive     | BOOLEAN      | DEFAULT FALSE   |
| archived_at    | TIMESTAMP    | NULL            |
| archived_by    | BIGINT       | NULL            |

Indexes

- email
- phone
- role
- status

Unique

- email
- phone

Relationships

User

├── CustomerProfile

├── RefreshTokens

├── PasswordResetTokens

├── CustomerAddresses

├── Cart

├── Orders

└── AuditLogs

Business Rules

- Password must be bcrypt hashed.
- Email must be unique.
- Phone number must be unique.
- Only ADMIN and CUSTOMER roles are allowed.
- Archived users cannot authenticate.

Authentication

JWT Authentication

-

Refresh Token Authentication

Passwords are never stored in plain text.

# TABLE : customer_profiles

Purpose

Stores customer profile information.

Authentication details are stored in the users table.

One User

↓

One Customer Profile

---

Columns

| Column           | Type         | Constraints                 |
| ---------------- | ------------ | --------------------------- |
| id               | BIGSERIAL    | PK                          |
| user_id          | BIGINT       | FK users.id UNIQUE NOT NULL |
| first_name       | VARCHAR(100) | NOT NULL                    |
| last_name        | VARCHAR(100) | NULL                        |
| profile_image_id | BIGINT       | FK media.id NULL            |
| date_of_birth    | DATE         | NULL                        |
| gender           | Gender       | DEFAULT UNISEX              |
| created_at       | TIMESTAMP    | NOT NULL                    |
| updated_at       | TIMESTAMP    | NOT NULL                    |
| created_by       | BIGINT       | NULL                        |
| updated_by       | BIGINT       | NULL                        |
| is_archive       | BOOLEAN      | DEFAULT FALSE               |
| archived_at      | TIMESTAMP    | NULL                        |
| archived_by      | BIGINT       | NULL                        |

---

Indexes

- user_id

Relationships

CustomerProfile

↓

User

CustomerProfile

↓

CustomerAddresses

CustomerProfile

↓

Orders

Business Rules

- Every CUSTOMER must have one profile.
- ADMIN users do not require a customer profile.
- One user can own only one customer profile.

---

# TABLE : refresh_tokens

Purpose

Stores refresh tokens for authenticated sessions.

Supports multiple devices per user.

Example

Mobile App

↓

Refresh Token A

Laptop

↓

Refresh Token B

Tablet

↓

Refresh Token C

---

Columns

| Column     | Type         | Constraints          |
| ---------- | ------------ | -------------------- |
| id         | BIGSERIAL    | PK                   |
| user_id    | BIGINT       | FK users.id NOT NULL |
| token      | TEXT         | UNIQUE NOT NULL      |
| expires_at | TIMESTAMP    | NOT NULL             |
| revoked_at | TIMESTAMP    | NULL                 |
| ip_address | VARCHAR(100) | NULL                 |
| user_agent | TEXT         | NULL                 |
| created_at | TIMESTAMP    | NOT NULL             |
| updated_at | TIMESTAMP    | NOT NULL             |

Indexes

- user_id
- token
- expires_at

Relationships

Many Refresh Tokens

↓

One User

Business Rules

- Multiple active refresh tokens are allowed.
- Logout revokes only the current refresh token.
- Logout All Devices revokes every active token.
- Expired tokens should be cleaned using scheduled jobs.

---

# TABLE : password_reset_tokens

Purpose

Stores temporary password reset tokens.

These tokens are short-lived.

---

Columns

| Column     | Type         | Constraints          |
| ---------- | ------------ | -------------------- |
| id         | BIGSERIAL    | PK                   |
| user_id    | BIGINT       | FK users.id NOT NULL |
| token      | VARCHAR(255) | UNIQUE NOT NULL      |
| expires_at | TIMESTAMP    | NOT NULL             |
| used_at    | TIMESTAMP    | NULL                 |
| created_at | TIMESTAMP    | NOT NULL             |

Indexes

- user_id
- token
- expires_at

Relationships

Many Reset Tokens

↓

One User

Business Rules

- Only one active reset token per user.
- Used tokens cannot be reused.
- Expired tokens are invalid.
- Tokens should be removed periodically by scheduled cleanup jobs.

---

# AUTHENTICATION RELATIONSHIP

users

├── customer_profiles (1 : 1)

├── refresh_tokens (1 : N)

└── password_reset_tokens (1 : N)

---

# AUTHENTICATION FLOW

Customer Registration

↓

Create User

↓

Create Customer Profile

↓

Generate JWT

↓

Generate Refresh Token

↓

Return Authentication Response

---

Customer Login

↓

Validate Credentials

↓

Generate JWT

↓

Generate Refresh Token

↓

Store Refresh Token

↓

Return Tokens

---

Forgot Password

↓

Generate Reset Token

↓

Store Token

↓

(Future)

Send Email

↓

Reset Password

↓

Invalidate Token

---

LOGIN VALIDATION

Validate

- Email exists
- User is ACTIVE
- User is NOT archived
- Password matches
- Account is allowed to login

Reject

- Invalid email
- Invalid password
- Archived account
- Inactive account

---

SECURITY RULES

Passwords

- bcrypt hash only
- Never return password in API responses

Refresh Tokens

- Store securely
- Revoke on logout
- Validate expiry before issuing a new access token

Password Reset

- Single-use tokens
- Time-limited validity
- Remove after successful password reset

# TABLE : customer_addresses

Purpose

Stores delivery addresses for customers.

A customer can have multiple addresses.

One address can be marked as the default delivery address.

---

Columns

| Column         | Type         | Constraints          |
| -------------- | ------------ | -------------------- |
| id             | BIGSERIAL    | PK                   |
| user_id        | BIGINT       | FK users.id NOT NULL |
| full_name      | VARCHAR(150) | NOT NULL             |
| phone          | VARCHAR(20)  | NOT NULL             |
| address_line_1 | VARCHAR(255) | NOT NULL             |
| address_line_2 | VARCHAR(255) | NULL                 |
| landmark       | VARCHAR(255) | NULL                 |
| city           | VARCHAR(100) | NOT NULL             |
| state          | VARCHAR(100) | NOT NULL             |
| postal_code    | VARCHAR(20)  | NOT NULL             |
| country        | VARCHAR(100) | DEFAULT 'India'      |
| is_default     | BOOLEAN      | DEFAULT FALSE        |
| created_at     | TIMESTAMP    | NOT NULL             |
| updated_at     | TIMESTAMP    | NOT NULL             |
| created_by     | BIGINT       | NULL                 |
| updated_by     | BIGINT       | NULL                 |
| is_archive     | BOOLEAN      | DEFAULT FALSE        |
| archived_at    | TIMESTAMP    | NULL                 |
| archived_by    | BIGINT       | NULL                 |

---

Indexes

- user_id
- city
- postal_code
- is_default

Relationships

User

↓

CustomerAddresses

Business Rules

- A customer can have multiple addresses.
- Only one address can be marked as default.
- Archived addresses cannot be selected during checkout.
- Orders always store an address snapshot.
- Customers can update or archive their own addresses only.

---

Validation

Required

- full_name
- phone
- address_line_1
- city
- state
- postal_code

---

# TABLE : schools

Purpose

Stores all schools available in the system.

Customers select a school before browsing uniforms.

---

Columns

| Column         | Type         | Constraints      |
| -------------- | ------------ | ---------------- |
| id             | BIGSERIAL    | PK               |
| name           | VARCHAR(255) | UNIQUE NOT NULL  |
| logo_media_id  | BIGINT       | FK media.id NULL |
| address        | TEXT         | NOT NULL         |
| contact_number | VARCHAR(20)  | NOT NULL         |
| email          | VARCHAR(255) | NULL             |
| status         | SchoolStatus | DEFAULT ACTIVE   |
| display_order  | INTEGER      | DEFAULT 0        |
| created_at     | TIMESTAMP    | NOT NULL         |
| updated_at     | TIMESTAMP    | NOT NULL         |
| created_by     | BIGINT       | NULL             |
| updated_by     | BIGINT       | NULL             |
| is_archive     | BOOLEAN      | DEFAULT FALSE    |
| archived_at    | TIMESTAMP    | NULL             |
| archived_by    | BIGINT       | NULL             |

---

Indexes

- name
- status
- display_order

Relationships

School

↓

UniformSchoolMappings

School

↓

Orders

Business Rules

- School names must be unique.
- Only ACTIVE schools are visible to customers.
- Display order controls frontend listing.
- Schools are never hard deleted.

---

Validation

Required

- name
- address
- contact_number

Optional

- email
- logo

---

# TABLE : categories

Purpose

Stores product categories.

Examples

- Shirt
- Pant
- Skirt
- Belt
- Shoes
- Socks
- Sweater
- Tie

---

Columns

| Column        | Type           | Constraints     |
| ------------- | -------------- | --------------- |
| id            | BIGSERIAL      | PK              |
| name          | VARCHAR(100)   | UNIQUE NOT NULL |
| description   | TEXT           | NULL            |
| status        | CategoryStatus | DEFAULT ACTIVE  |
| display_order | INTEGER        | DEFAULT 0       |
| created_at    | TIMESTAMP      | NOT NULL        |
| updated_at    | TIMESTAMP      | NOT NULL        |
| created_by    | BIGINT         | NULL            |
| updated_by    | BIGINT         | NULL            |
| is_archive    | BOOLEAN        | DEFAULT FALSE   |
| archived_at   | TIMESTAMP      | NULL            |
| archived_by   | BIGINT         | NULL            |

---

Indexes

- name
- status
- display_order

Relationships

Category

↓

Uniforms

Business Rules

- Category names are unique.
- Categories cannot be deleted while active uniforms exist.
- Archived categories are hidden from customers.

---

Validation

Required

- name

Optional

- description

---

# CUSTOMER ADDRESS RELATIONSHIP

User

1

↓

N

CustomerAddresses

---

# SCHOOL RELATIONSHIP

School

1

↓

N

UniformSchoolMappings

↓

N

Uniforms

(Many-to-Many)

---

# CATEGORY RELATIONSHIP

Category

1

↓

N

Uniforms

---

SEARCHABLE FIELDS

Customer Address

- full_name
- phone
- city
- state
- postal_code

School

- name
- contact_number
- email

Category

- name

---

FILTERABLE FIELDS

Customer Address

- city
- state

School

- status

Category

- status

---

SOFT DELETE POLICY

Customer Addresses

✔ Soft Delete

Schools

✔ Soft Delete

Categories

✔ Soft Delete

These records are never physically removed from the database.

# TABLE : uniforms

Purpose

Stores the master catalog of uniform products.

A uniform is NOT directly assigned to a school.

Schools are mapped through the
uniform_school_mappings table.

Examples

- White Half Sleeve Shirt
- Blue Full Pant
- School Belt
- Winter Sweater

---

Columns

| Column        | Type          | Constraints               |
| ------------- | ------------- | ------------------------- |
| id            | BIGSERIAL     | PK                        |
| category_id   | BIGINT        | FK categories.id NOT NULL |
| sku           | VARCHAR(100)  | UNIQUE NOT NULL           |
| name          | VARCHAR(255)  | NOT NULL                  |
| description   | TEXT          | NULL                      |
| status        | UniformStatus | DEFAULT ACTIVE            |
| display_order | INTEGER       | DEFAULT 0                 |
| created_at    | TIMESTAMP     | NOT NULL                  |
| updated_at    | TIMESTAMP     | NOT NULL                  |
| created_by    | BIGINT        | NULL                      |
| updated_by    | BIGINT        | NULL                      |
| is_archive    | BOOLEAN       | DEFAULT FALSE             |
| archived_at   | TIMESTAMP     | NULL                      |
| archived_by   | BIGINT        | NULL                      |

---

Indexes

- category_id
- sku
- name
- status
- display_order

Unique

- sku

Relationships

Uniform

↓

Category

Uniform

↓

UniformVariants

Uniform

↓

Media

Uniform

↓

UniformSchoolMappings

---

Business Rules

- Every uniform belongs to exactly one category.
- SKU must be globally unique.
- Uniforms cannot exist without a category.
- Archived uniforms cannot be purchased.
- Only ACTIVE uniforms are visible to customers.

---

SKU FORMAT

Recommended

UNI-000001

or

SCH-SHIRT-000001

SKU generation must be handled by the service layer.

---

# TABLE : uniform_school_mappings

Purpose

Maps uniforms to schools.

Supports

Many Schools

↓

Many Uniforms

without duplicating products.

---

Columns

| Column      | Type      | Constraints             |
| ----------- | --------- | ----------------------- |
| id          | BIGSERIAL | PK                      |
| school_id   | BIGINT    | FK schools.id NOT NULL  |
| uniform_id  | BIGINT    | FK uniforms.id NOT NULL |
| is_active   | BOOLEAN   | DEFAULT TRUE            |
| created_at  | TIMESTAMP | NOT NULL                |
| updated_at  | TIMESTAMP | NOT NULL                |
| created_by  | BIGINT    | NULL                    |
| updated_by  | BIGINT    | NULL                    |
| is_archive  | BOOLEAN   | DEFAULT FALSE           |
| archived_at | TIMESTAMP | NULL                    |
| archived_by | BIGINT    | NULL                    |

---

Indexes

- school_id
- uniform_id
- is_active

Composite Unique

(school_id, uniform_id)

Relationships

School

↓

UniformSchoolMappings

↓

Uniform

---

Business Rules

- Duplicate mappings are not allowed.
- Mapping can be enabled or disabled.
- Mapping can be archived.
- Customers only see active mappings.
- Uniform must be ACTIVE.
- School must be ACTIVE.

---

# TABLE : uniform_variants

Purpose

Stores purchasable variants for every uniform.

Each variant maintains its own

- price
- gender
- size

Example

White Shirt

↓

Size 28

↓

₹550

White Shirt

↓

Size 30

↓

₹570

---

Columns

| Column               | Type          | Constraints             |
| -------------------- | ------------- | ----------------------- |
| id                   | BIGSERIAL     | PK                      |
| uniform_id           | BIGINT        | FK uniforms.id NOT NULL |
| size                 | VARCHAR(30)   | NOT NULL                |
| gender               | Gender        | DEFAULT UNISEX          |
| price                | DECIMAL(12,2) | NOT NULL                |
| quantity_requirement | INTEGER       | DEFAULT 1               |
| status               | VariantStatus | DEFAULT ACTIVE          |
| display_order        | INTEGER       | DEFAULT 0               |
| created_at           | TIMESTAMP     | NOT NULL                |
| updated_at           | TIMESTAMP     | NOT NULL                |
| created_by           | BIGINT        | NULL                    |
| updated_by           | BIGINT        | NULL                    |
| is_archive           | BOOLEAN       | DEFAULT FALSE           |
| archived_at          | TIMESTAMP     | NULL                    |
| archived_by          | BIGINT        | NULL                    |

---

Indexes

- uniform_id
- size
- gender
- status

Composite Unique

(uniform_id, size, gender)

Relationships

Uniform

↓

UniformVariants

Referenced By

- Cart Items
- Order Items

---

Business Rules

- Price must be greater than zero.
- Quantity requirement must be greater than zero.
- Duplicate size + gender combinations are not allowed.
- Archived variants cannot be added to cart.
- Only ACTIVE variants can be purchased.

---

Validation

Required

- uniform_id
- size
- price

Optional

- gender
- quantity_requirement

---

# PRODUCT CATALOG RELATIONSHIP

Category

1

↓

N

Uniform

1

↓

N

UniformVariant

Uniform

N

↓

N

School

(via uniform_school_mappings)

Uniform

1

↓

N

Media

---

SEARCHABLE FIELDS

Uniform

- sku
- name

Variant

- size
- gender

School Mapping

- school_id
- uniform_id

---

FILTERABLE FIELDS

Uniform

- category
- status

Variant

- gender
- size
- status

School Mapping

- school
- active

---

SOFT DELETE POLICY

Uniforms

✔ Soft Delete

Uniform Variants

✔ Soft Delete

Uniform School Mappings

✔ Soft Delete

Archived products are never returned in customer APIs.

Archived mappings are ignored during product listing.

# TABLE : media

Purpose

Stores metadata for all uploaded media files.

This is a generic media table and replaces the
uniform_images table.

Supported Entities

- Uniform Images
- School Logos
- Customer Profile Images

Future

- Category Images
- Documents
- Certificates

Only metadata is stored.

Binary files are stored in Amazon S3.

---

Columns

| Column        | Type            | Constraints     |
| ------------- | --------------- | --------------- |
| id            | BIGSERIAL       | PK              |
| entity_type   | MediaEntityType | NOT NULL        |
| entity_id     | BIGINT          | NOT NULL        |
| s3_key        | VARCHAR(500)    | UNIQUE NOT NULL |
| image_url     | VARCHAR(1000)   | NOT NULL        |
| mime_type     | VARCHAR(100)    | NOT NULL        |
| file_name     | VARCHAR(255)    | NOT NULL        |
| file_size     | BIGINT          | NOT NULL        |
| is_thumbnail  | BOOLEAN         | DEFAULT FALSE   |
| display_order | INTEGER         | DEFAULT 1       |
| created_at    | TIMESTAMP       | NOT NULL        |
| updated_at    | TIMESTAMP       | NOT NULL        |
| created_by    | BIGINT          | NULL            |
| updated_by    | BIGINT          | NULL            |
| is_archive    | BOOLEAN         | DEFAULT FALSE   |
| archived_at   | TIMESTAMP       | NULL            |
| archived_by   | BIGINT          | NULL            |

---

Indexes

- entity_type
- entity_id
- is_thumbnail
- display_order

Composite Index

(entity_type, entity_id)

Relationships

Media

↓

Uniform

Media

↓

School

Media

↓

Customer Profile

---

Business Rules

- Store metadata only.
- Binary files must never be stored in PostgreSQL.
- Maximum file size: 5 MB.
- Supported MIME types:
  - image/jpeg
  - image/png
  - image/webp
- UUID filenames only.
- Delete S3 object before archiving database record.
- One thumbnail per entity.

---

S3 Object Structure

uniforms/{schoolId}/{uniformId}/{uuid}.jpg

schools/{schoolId}/{uuid}.png

users/{userId}/{uuid}.jpg

---

# TABLE : carts

Purpose

Stores the active shopping cart for a customer.

Each customer can have only one ACTIVE cart.

---

Columns

| Column      | Type       | Constraints            |
| ----------- | ---------- | ---------------------- |
| id          | BIGSERIAL  | PK                     |
| user_id     | BIGINT     | FK users.id NOT NULL   |
| school_id   | BIGINT     | FK schools.id NOT NULL |
| status      | CartStatus | DEFAULT ACTIVE         |
| created_at  | TIMESTAMP  | NOT NULL               |
| updated_at  | TIMESTAMP  | NOT NULL               |
| created_by  | BIGINT     | NULL                   |
| updated_by  | BIGINT     | NULL                   |
| is_archive  | BOOLEAN    | DEFAULT FALSE          |
| archived_at | TIMESTAMP  | NULL                   |
| archived_by | BIGINT     | NULL                   |

---

Indexes

- user_id
- school_id
- status

Relationships

User

↓

Cart

School

↓

Cart

Cart

↓

CartItems

Business Rules

- One ACTIVE cart per user.
- Cart belongs to exactly one school.
- All products inside a cart must belong to the selected school.
- Cart becomes CHECKED_OUT after successful order creation.
- Archived carts cannot be modified.

Application Constraint

Only one ACTIVE cart per user.

---

# TABLE : cart_items

Purpose

Stores products added to a shopping cart.

Each record references a uniform variant.

---

Columns

| Column      | Type      | Constraints                     |
| ----------- | --------- | ------------------------------- |
| id          | BIGSERIAL | PK                              |
| cart_id     | BIGINT    | FK carts.id NOT NULL            |
| variant_id  | BIGINT    | FK uniform_variants.id NOT NULL |
| quantity    | INTEGER   | NOT NULL                        |
| created_at  | TIMESTAMP | NOT NULL                        |
| updated_at  | TIMESTAMP | NOT NULL                        |
| created_by  | BIGINT    | NULL                            |
| updated_by  | BIGINT    | NULL                            |
| is_archive  | BOOLEAN   | DEFAULT FALSE                   |
| archived_at | TIMESTAMP | NULL                            |
| archived_by | BIGINT    | NULL                            |

---

Indexes

- cart_id
- variant_id

Composite Unique

(cart_id, variant_id)

Relationships

Cart

↓

CartItems

UniformVariant

↓

CartItems

Business Rules

- Quantity must be greater than zero.
- Duplicate variants are not allowed in the same cart.
- Updating quantity updates the existing row.
- Archived variants cannot be added.
- Archived carts cannot be modified.

---

Cart Calculations

The following values are calculated dynamically.

- Total Items
- Total Quantity
- Subtotal
- Grand Total

Formula

Item Total

price × quantity

Grand Total

SUM(all item totals)

---

Cart Validation

Before adding an item

Validate

- User exists
- Active cart exists (or create one)
- School exists
- Uniform exists
- School mapping exists
- Variant exists
- Variant is ACTIVE
- Quantity > 0

Reject

- Invalid school
- Invalid variant
- Archived uniform
- Archived variant
- Cross-school products

---

CATALOG RELATIONSHIP

Category

↓

Uniform

↓

UniformVariant

↓

CartItem

↓

Cart

↓

User

# TABLE : orders

Purpose

Stores orders placed by customers.

Orders are created only from an ACTIVE cart.

Orders are immutable business records.

Customer information, address information, school information,
and pricing are copied into snapshot tables during checkout.

---

Columns

| Column         | Type          | Constraints            |
| -------------- | ------------- | ---------------------- |
| id             | BIGSERIAL     | PK                     |
| order_number   | VARCHAR(50)   | UNIQUE NOT NULL        |
| customer_id    | BIGINT        | FK users.id NOT NULL   |
| school_id      | BIGINT        | FK schools.id NOT NULL |
| status         | OrderStatus   | DEFAULT DRAFT          |
| subtotal       | DECIMAL(12,2) | NOT NULL               |
| grand_total    | DECIMAL(12,2) | NOT NULL               |
| total_items    | INTEGER       | DEFAULT 0              |
| total_quantity | INTEGER       | DEFAULT 0              |
| notes          | TEXT          | NULL                   |
| created_at     | TIMESTAMP     | NOT NULL               |
| updated_at     | TIMESTAMP     | NOT NULL               |
| created_by     | BIGINT        | NULL                   |
| updated_by     | BIGINT        | NULL                   |
| is_archive     | BOOLEAN       | DEFAULT FALSE          |
| archived_at    | TIMESTAMP     | NULL                   |
| archived_by    | BIGINT        | NULL                   |

---

Indexes

- order_number
- customer_id
- school_id
- status
- created_at

Relationships

Order

├── OrderItems

├── Payment

├── Delivery

├── OrderCustomer

├── OrderAddress

├── OrderSchoolSnapshot

└── OrderStatusHistory

---

Business Rules

- Orders are created only from an ACTIVE cart.
- Order numbers are immutable.
- Orders are never hard deleted.
- Cancelled orders remain in the database.
- Snapshot data must never be updated after order creation.

---

Recommended Order Number Format

ORD-20260714-000001

Generation handled by the service layer.

---

# TABLE : order_items

Purpose

Stores purchased products.

Every record contains a permanent pricing snapshot.

Future product price changes must not affect historical orders.

---

Columns

| Column        | Type          | Constraints                     |
| ------------- | ------------- | ------------------------------- |
| id            | BIGSERIAL     | PK                              |
| order_id      | BIGINT        | FK orders.id NOT NULL           |
| uniform_id    | BIGINT        | FK uniforms.id NOT NULL         |
| variant_id    | BIGINT        | FK uniform_variants.id NOT NULL |
| sku           | VARCHAR(100)  | NOT NULL                        |
| product_name  | VARCHAR(255)  | NOT NULL                        |
| category_name | VARCHAR(100)  | NOT NULL                        |
| size          | VARCHAR(30)   | NOT NULL                        |
| gender        | Gender        | NOT NULL                        |
| unit_price    | DECIMAL(12,2) | NOT NULL                        |
| quantity      | INTEGER       | NOT NULL                        |
| subtotal      | DECIMAL(12,2) | NOT NULL                        |
| created_at    | TIMESTAMP     | NOT NULL                        |
| updated_at    | TIMESTAMP     | NOT NULL                        |

---

Indexes

- order_id
- variant_id
- uniform_id

Relationships

Order

↓

OrderItems

Business Rules

- Product name is stored permanently.
- SKU is stored permanently.
- Unit price never changes.
- Quantity must be greater than zero.

Formula

subtotal = unit_price × quantity

---

# TABLE : order_customers

Purpose

Stores customer information snapshot.

This preserves historical accuracy if the customer updates
their profile later.

---

Columns

| Column        | Type         | Constraints                  |
| ------------- | ------------ | ---------------------------- |
| id            | BIGSERIAL    | PK                           |
| order_id      | BIGINT       | FK orders.id UNIQUE NOT NULL |
| customer_name | VARCHAR(255) | NOT NULL                     |
| email         | VARCHAR(255) | NOT NULL                     |
| phone         | VARCHAR(20)  | NOT NULL                     |
| created_at    | TIMESTAMP    | NOT NULL                     |

---

Indexes

- order_id

Business Rules

- One snapshot per order.
- Snapshot is immutable.
- Never synchronize with user profile updates.

---

# TABLE : order_addresses

Purpose

Stores delivery address snapshot.

Customer address changes must never affect previous orders.

---

Columns

| Column         | Type         | Constraints                  |
| -------------- | ------------ | ---------------------------- |
| id             | BIGSERIAL    | PK                           |
| order_id       | BIGINT       | FK orders.id UNIQUE NOT NULL |
| full_name      | VARCHAR(150) | NOT NULL                     |
| phone          | VARCHAR(20)  | NOT NULL                     |
| address_line_1 | VARCHAR(255) | NOT NULL                     |
| address_line_2 | VARCHAR(255) | NULL                         |
| landmark       | VARCHAR(255) | NULL                         |
| city           | VARCHAR(100) | NOT NULL                     |
| state          | VARCHAR(100) | NOT NULL                     |
| postal_code    | VARCHAR(20)  | NOT NULL                     |
| country        | VARCHAR(100) | NOT NULL                     |
| created_at     | TIMESTAMP    | NOT NULL                     |

---

Indexes

- order_id

Business Rules

- One address snapshot per order.
- Snapshot never changes.

---

# TABLE : order_school_snapshots

Purpose

Stores school information at the time of purchase.

Future school updates must not affect historical orders.

---

Columns

| Column         | Type         | Constraints                  |
| -------------- | ------------ | ---------------------------- |
| id             | BIGSERIAL    | PK                           |
| order_id       | BIGINT       | FK orders.id UNIQUE NOT NULL |
| school_name    | VARCHAR(255) | NOT NULL                     |
| school_address | TEXT         | NULL                         |
| contact_number | VARCHAR(20)  | NULL                         |
| created_at     | TIMESTAMP    | NOT NULL                     |

---

Indexes

- order_id

Business Rules

- One school snapshot per order.
- Snapshot is immutable.

---

ORDER WORKFLOW

DRAFT

↓

PENDING_PAYMENT

↓

CONFIRMED

↓

RECEIVED

↓

PREPARING_FOR_DISPATCH

↓

DISPATCHED

↓

DELIVERED

OR

CANCELLED

---

CHECKOUT FLOW

Validate Cart

↓

Validate Customer

↓

Validate School

↓

Validate Variants

↓

Calculate Totals

↓

Create Order

↓

Create Order Items

↓

Create Order Customer Snapshot

↓

Create Order Address Snapshot

↓

Create Order School Snapshot

↓

Create Payment Record

↓

Mark Cart as CHECKED_OUT

↓

Commit Transaction

If any step fails

↓

Rollback Entire Transaction

# TABLE : payments

Purpose

Stores the primary payment record for an order.

Version 1 uses simulated payments.

Future versions can integrate Razorpay, Stripe,
or any other payment gateway without changing
the order structure.

---

Columns

| Column            | Type          | Constraints                  |
| ----------------- | ------------- | ---------------------------- |
| id                | BIGSERIAL     | PK                           |
| order_id          | BIGINT        | FK orders.id UNIQUE NOT NULL |
| transaction_id    | UUID          | UNIQUE NOT NULL              |
| payment_method    | PaymentMethod | DEFAULT SIMULATED            |
| status            | PaymentStatus | DEFAULT PENDING              |
| amount            | DECIMAL(12,2) | NOT NULL                     |
| gateway_reference | VARCHAR(255)  | NULL                         |
| paid_at           | TIMESTAMP     | NULL                         |
| created_at        | TIMESTAMP     | NOT NULL                     |
| updated_at        | TIMESTAMP     | NOT NULL                     |
| created_by        | BIGINT        | NULL                         |
| updated_by        | BIGINT        | NULL                         |
| is_archive        | BOOLEAN       | DEFAULT FALSE                |
| archived_at       | TIMESTAMP     | NULL                         |
| archived_by       | BIGINT        | NULL                         |

---

Indexes

- order_id
- transaction_id
- status

Relationships

Payment

↓

PaymentTransactions

Order

↓

Payment

---

Business Rules

- One payment per order.
- Amount must equal order grand total.
- Transaction ID must be globally unique.
- Payment status determines order progression.

---

# TABLE : payment_transactions

Purpose

Stores every payment attempt.

Useful for

- retries
- gateway logs
- future integrations
- auditing

---

Columns

| Column                | Type          | Constraints             |
| --------------------- | ------------- | ----------------------- |
| id                    | BIGSERIAL     | PK                      |
| payment_id            | BIGINT        | FK payments.id NOT NULL |
| transaction_reference | UUID          | UNIQUE NOT NULL         |
| status                | PaymentStatus | NOT NULL                |
| gateway               | VARCHAR(100)  | DEFAULT 'SIMULATED'     |
| gateway_response      | JSONB         | NULL                    |
| remarks               | TEXT          | NULL                    |
| processed_at          | TIMESTAMP     | NOT NULL                |
| created_at            | TIMESTAMP     | NOT NULL                |

---

Indexes

- payment_id
- transaction_reference
- status

Relationships

Many Payment Transactions

↓

One Payment

---

Business Rules

- Multiple payment attempts are allowed.
- Successful payment confirms the order.
- Failed payment does not delete the order.
- Every gateway response should be preserved.

---

PAYMENT FLOW

Pending

↓

Attempt

↓

Success

↓

Order Confirmed

OR

Pending

↓

Attempt

↓

Failed

↓

Retry

↓

Success

---

# TABLE : deliveries

Purpose

Stores delivery information for each order.

Only one delivery record exists per order.

Tracking is managed externally.

---

Columns

| Column          | Type           | Constraints                  |
| --------------- | -------------- | ---------------------------- |
| id              | BIGSERIAL      | PK                           |
| order_id        | BIGINT         | FK orders.id UNIQUE NOT NULL |
| courier_name    | VARCHAR(150)   | NULL                         |
| tracking_number | VARCHAR(255)   | NULL                         |
| tracking_url    | VARCHAR(1000)  | NULL                         |
| current_status  | DeliveryStatus | DEFAULT PREPARING            |
| delivered_at    | TIMESTAMP      | NULL                         |
| remarks         | TEXT           | NULL                         |
| created_at      | TIMESTAMP      | NOT NULL                     |
| updated_at      | TIMESTAMP      | NOT NULL                     |
| created_by      | BIGINT         | NULL                         |
| updated_by      | BIGINT         | NULL                         |
| is_archive      | BOOLEAN        | DEFAULT FALSE                |
| archived_at     | TIMESTAMP      | NULL                         |
| archived_by     | BIGINT         | NULL                         |

---

Indexes

- order_id
- tracking_number
- current_status

Relationships

Order

↓

Delivery

Delivery

↓

DeliveryStatusHistory

---

Business Rules

- One delivery per order.
- Tracking number is optional until dispatch.
- Tracking URL is optional.
- Customers can track deliveries using tracking number.

---

# TABLE : delivery_status_history

Purpose

Maintains the complete delivery timeline.

Every delivery status update creates a new record.

---

Columns

| Column      | Type           | Constraints               |
| ----------- | -------------- | ------------------------- |
| id          | BIGSERIAL      | PK                        |
| delivery_id | BIGINT         | FK deliveries.id NOT NULL |
| status      | DeliveryStatus | NOT NULL                  |
| remarks     | TEXT           | NULL                      |
| changed_by  | BIGINT         | FK users.id NULL          |
| created_at  | TIMESTAMP      | NOT NULL                  |

---

Indexes

- delivery_id
- status
- created_at

Relationships

Many Delivery Status Records

↓

One Delivery

---

Business Rules

- History records are immutable.
- Never update history.
- Always insert a new row.

---

Delivery Timeline

PREPARING

↓

PACKED

↓

DISPATCHED

↓

IN_TRANSIT

↓

OUT_FOR_DELIVERY

↓

DELIVERED

---

# TABLE : order_status_history

Purpose

Stores the complete lifecycle of an order.

Every status transition is recorded.

---

Columns

| Column     | Type        | Constraints           |
| ---------- | ----------- | --------------------- |
| id         | BIGSERIAL   | PK                    |
| order_id   | BIGINT      | FK orders.id NOT NULL |
| status     | OrderStatus | NOT NULL              |
| remarks    | TEXT        | NULL                  |
| changed_by | BIGINT      | FK users.id NULL      |
| created_at | TIMESTAMP   | NOT NULL              |

---

Indexes

- order_id
- status
- created_at

Relationships

Many Order Status Records

↓

One Order

---

Business Rules

- Status history is append-only.
- Never overwrite previous status.
- Every order begins with DRAFT.
- Every transition creates a new history record.

---

ORDER STATUS FLOW

DRAFT

↓

PENDING_PAYMENT

↓

CONFIRMED

↓

RECEIVED

↓

PREPARING_FOR_DISPATCH

↓

DISPATCHED

↓

DELIVERED

OR

↓

CANCELLED

---

TRANSACTION RULES

Checkout

- Validate Cart
- Create Order
- Create Order Items
- Create Snapshots
- Create Payment
- Create Initial Status History
- Create Delivery Record
- Commit

Failure

↓

Rollback Entire Transaction

---

PAYMENT VALIDATION

- Payment amount must equal order total.
- Order must exist.
- Order must not already be paid.
- Only SUCCESS payments confirm orders.
- FAILED payments remain retryable.

# TABLE : audit_logs

Purpose

Stores important system events for auditing,
security monitoring, debugging and compliance.

Audit logs are append-only.

Audit logs are never updated.

Audit logs are never deleted.

---

Columns

| Column         | Type         | Constraints      |
| -------------- | ------------ | ---------------- |
| id             | BIGSERIAL    | PK               |
| user_id        | BIGINT       | FK users.id NULL |
| action         | VARCHAR(100) | NOT NULL         |
| entity         | AuditEntity  | NOT NULL         |
| entity_id      | BIGINT       | NULL             |
| request_method | VARCHAR(10)  | NULL             |
| request_url    | TEXT         | NULL             |
| ip_address     | VARCHAR(100) | NULL             |
| user_agent     | TEXT         | NULL             |
| request_id     | UUID         | NULL             |
| metadata       | JSONB        | NULL             |
| created_at     | TIMESTAMP    | NOT NULL         |

---

Indexes

- user_id
- entity
- entity_id
- action
- request_id
- created_at

---

Relationships

Many Audit Logs

↓

One User

---

Example Actions

Authentication

- LOGIN
- LOGOUT
- REGISTER
- REFRESH_TOKEN
- CHANGE_PASSWORD
- RESET_PASSWORD

Catalog

- CREATE_CATEGORY
- UPDATE_CATEGORY
- DELETE_CATEGORY

Schools

- CREATE_SCHOOL
- UPDATE_SCHOOL
- DELETE_SCHOOL

Uniforms

- CREATE_UNIFORM
- UPDATE_UNIFORM
- DELETE_UNIFORM

Variants

- CREATE_VARIANT
- UPDATE_VARIANT
- DELETE_VARIANT

Media

- MEDIA_UPLOAD
- MEDIA_DELETE

Cart

- CART_CREATED
- ITEM_ADDED
- ITEM_UPDATED
- ITEM_REMOVED
- CART_CHECKOUT

Orders

- ORDER_CREATED
- ORDER_CONFIRMED
- ORDER_CANCELLED
- ORDER_DISPATCHED
- ORDER_DELIVERED

Payments

- PAYMENT_CREATED
- PAYMENT_SUCCESS
- PAYMENT_FAILED

Delivery

- DELIVERY_CREATED
- DELIVERY_UPDATED

---

# COMPLETE ENTITY RELATIONSHIP

users

├── customer_profiles

├── refresh_tokens

├── password_reset_tokens

├── customer_addresses

├── carts

├── orders

└── audit_logs

categories

└── uniforms

schools

└── uniform_school_mappings

uniforms

├── uniform_variants

├── media

└── uniform_school_mappings

carts

└── cart_items

orders

├── order_items

├── order_customers

├── order_addresses

├── order_school_snapshots

├── payments

├── deliveries

└── order_status_history

payments

└── payment_transactions

deliveries

└── delivery_status_history

---

# FOREIGN KEY RULES

User

↓

Customer Profile

ON DELETE RESTRICT

User

↓

Customer Address

ON DELETE RESTRICT

Category

↓

Uniform

ON DELETE RESTRICT

Uniform

↓

Variant

ON DELETE CASCADE

Uniform

↓

School Mapping

ON DELETE CASCADE

School

↓

School Mapping

ON DELETE CASCADE

Cart

↓

Cart Item

ON DELETE CASCADE

Order

↓

Order Item

ON DELETE CASCADE

Order

↓

Order Customer

ON DELETE CASCADE

Order

↓

Order Address

ON DELETE CASCADE

Order

↓

Order School Snapshot

ON DELETE CASCADE

Order

↓

Payment

ON DELETE CASCADE

Payment

↓

Payment Transactions

ON DELETE CASCADE

Order

↓

Delivery

ON DELETE CASCADE

Delivery

↓

Delivery Status History

ON DELETE CASCADE

Order

↓

Order Status History

ON DELETE CASCADE

---

# INDEX STRATEGY

Primary Keys

All tables use BIGSERIAL.

Unique Indexes

- users.email
- users.phone
- schools.name
- categories.name
- uniforms.sku
- orders.order_number
- payments.transaction_id

Composite Indexes

uniform_school_mappings

(school_id, uniform_id)

uniform_variants

(uniform_id, size, gender)

cart_items

(cart_id, variant_id)

media

(entity_type, entity_id)

Search Indexes

- users.email
- users.phone
- schools.name
- categories.name
- uniforms.name
- uniforms.sku
- orders.order_number
- deliveries.tracking_number

Status Indexes

- users.status
- schools.status
- categories.status
- uniforms.status
- uniform_variants.status
- orders.status
- payments.status
- deliveries.current_status

---

# DATABASE TRANSACTIONS

Use Sequelize Transactions for

Authentication

- Registration

Catalog

- Create Uniform
- Update Uniform
- Create Variant
- Upload Media

Cart

- Add Item
- Update Quantity
- Checkout

Orders

- Create Order
- Cancel Order
- Status Update

Payments

- Create Payment
- Payment Confirmation

Delivery

- Create Delivery
- Delivery Status Update

Rollback entire transaction if any operation fails.

---

# SOFT DELETE POLICY

Soft Delete

- Users
- Customer Profiles
- Addresses
- Schools
- Categories
- Uniforms
- Variants
- Media
- School Mappings
- Carts
- Cart Items
- Orders
- Payments
- Deliveries

Never Soft Delete

- Audit Logs
- Order Status History
- Delivery Status History
- Payment Transactions

These tables are immutable historical records.

---

# PERFORMANCE GUIDELINES

Always paginate list APIs.

Recommended

GET /api/v1/uniforms?page=1&limit=20

Use indexes on

- Foreign Keys
- Status Columns
- Search Columns

Avoid N+1 queries.

Use eager loading with Sequelize associations.

Store only media metadata in PostgreSQL.

Store files in Amazon S3.

Use transactions for all business-critical workflows.

---

# SEQUELIZE MODEL CREATION ORDER

1. User
2. CustomerProfile
3. RefreshToken
4. PasswordResetToken
5. CustomerAddress
6. School
7. Category
8. Uniform
9. UniformSchoolMapping
10. UniformVariant
11. Media
12. Cart
13. CartItem
14. Order
15. OrderItem
16. OrderCustomer
17. OrderAddress
18. OrderSchoolSnapshot
19. Payment
20. PaymentTransaction
21. Delivery
22. DeliveryStatusHistory
23. OrderStatusHistory
24. AuditLog

---

# MIGRATION ORDER

1. Create ENUM Types
2. Users
3. Customer Profiles
4. Refresh Tokens
5. Password Reset Tokens
6. Customer Addresses
7. Schools
8. Categories
9. Uniforms
10. Uniform School Mappings
11. Uniform Variants
12. Media
13. Carts
14. Cart Items
15. Orders
16. Order Items
17. Order Customers
18. Order Addresses
19. Order School Snapshots
20. Payments
21. Payment Transactions
22. Deliveries
23. Delivery Status History
24. Order Status History
25. Audit Logs
26. Create Indexes
27. Add Foreign Keys

---

# FUTURE EXTENSIONS

The schema supports future modules without breaking existing data.

Possible additions

- Inventory Management
- Stock Ledger
- Purchase Orders
- Suppliers
- Coupons
- Discounts
- Wishlist
- Product Reviews
- Notifications
- Email Service
- SMS Service
- WhatsApp Notifications
- Razorpay Integration
- Stripe Integration
- GST Invoicing
- Returns & Refunds
- Multi-language
- Analytics Dashboard
- ERP Integration
- Multi-Warehouse
- Multiple Delivery Partners

---

END OF SCHEMA
