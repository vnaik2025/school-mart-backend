# PHASES.md

# School Accessories Mart - Backend Implementation Phases

This document defines the implementation roadmap for the backend.

All implementation must follow the documentation below.

## Required Documentation

Read these documents completely before implementing anything.

- SETUP.md
- AGENT.md
- ARCHITECTURE.md
- FEATURE.md
- SCHEMA.md
- ROUTES_AND_BUSINESS_LOGIC.md
- S3_SKILL.md

These documents are the single source of truth.

---

# General Rules

- Follow Clean Architecture.
- Use Express.js.
- Use Sequelize ORM.
- Use PostgreSQL.
- Use ES Modules.
- Use async/await.
- Use JWT Authentication.
- Use Refresh Tokens.
- Use bcrypt for password hashing.
- Use Amazon S3 for media uploads.
- Store only media metadata in PostgreSQL.
- Follow SCHEMA.md exactly.
- Use centralized error handling.
- Use request validation.
- Use transactions where required.
- Follow SOLID principles.
- Keep controllers thin.
- Business logic belongs in Services.
- Database access belongs in Repositories.
- Use soft delete wherever defined in SCHEMA.md.
- Do not implement functionality outside the documented scope.

---

# Important Rule

Implement ONE phase at a time.

After finishing a phase:

- Stop immediately.
- Wait for approval.
- Do not continue to the next phase automatically.

For every phase provide:

- Folder Structure
- Files Created
- Files Modified
- Explanation
- Complete Code

---

# Phase 1

## Project Setup

Create

- Folder Structure
- Express Server
- Environment Loader
- Database Configuration
- Sequelize Initialization
- Logger
- Error Handler
- Response Helper
- Validation Setup
- API Versioning
- Route Registration
- Health Route
- Base Middleware

Do not create business modules.

STOP.

---

# Phase 2

## Database

Create

- Sequelize Models
- Associations
- Base Model
- ENUM Definitions
- Migrations
- Seeders

Create every model defined inside SCHEMA.md.

Do not create controllers.

STOP.

---

# Phase 3

## Authentication

Implement

- Register
- Login
- Refresh Token
- Logout
- Logout All Devices
- JWT Middleware
- Role Middleware
- Password Hashing
- Authentication Validation

STOP.

---

# Phase 4

## Customer Module

Implement

Customer Profile

Customer Address

Features

- View Profile
- Update Profile
- Change Password
- Upload Profile Image
- Add Address
- Update Address
- Delete Address
- List Addresses
- Set Default Address

STOP.

---

# Phase 5

## Catalog Module

Implement

Schools

Categories

Uniforms

Uniform Variants

Uniform School Mapping

Customer APIs

- Browse Schools
- Browse Categories
- Browse Products
- Product Details
- Search Products
- Filter Products

Admin APIs

Full CRUD

STOP.

---

# Phase 6

## Media Module

Implement

Amazon S3 Integration

Media Table

Image Upload

Image Delete

Thumbnail Support

Supported Entities

- Uniform
- School
- Customer

STOP.

---

# Phase 7

## Cart Module

Implement

Cart

Cart Items

Features

- Create Cart
- Add Item
- Remove Item
- Update Quantity
- Cart Summary
- Clear Cart

Validation

- School Mapping
- Variant Exists
- Active Product

STOP.

---

# Phase 8

## Order Module

Implement

Checkout

Order

Order Items

Order Customer Snapshot

Order Address Snapshot

Order School Snapshot

Order History

Order Details

Use Database Transactions.

STOP.

---

# Phase 9

## Payment Module

Implement

Simulated Payment

Payment

Payment Transactions

Payment Status Update

Future-ready Architecture

STOP.

---

# Phase 10

## Delivery Module

Implement

Delivery

Tracking

Delivery Status

Delivery Timeline

Order Status History

Delivery Status History

STOP.

---

# Phase 11

## Audit & Dashboard

Implement

Audit Logs

Admin Dashboard APIs

Dashboard Statistics

Recent Orders

Recent Payments

Recent Deliveries

STOP.

---

# Final Phase

## Project Review

Verify

Folder Structure

Architecture

Database

API Responses

Validation

Error Handling

Security

Authentication

Authorization

Transactions

S3 Integration

Clean Code

Remove Dead Code

Optimize Queries

Ensure the project fully matches

- FEATURE.md
- SCHEMA.md
- ROUTES_AND_BUSINESS_LOGIC.md
- ARCHITECTURE.md

Only after verification should the backend be considered complete.

END
