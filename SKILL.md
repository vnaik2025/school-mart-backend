# SKILL GUIDE

## Core Rules

- Use JavaScript ES6+
- Use Express.js
- Use PostgreSQL
- Use Sequelize ORM
- Use JWT authentication
- Use bcrypt for hashing

---

## API Rules

Every controller must:

- Validate input
- Handle errors
- Use sendResponse()

---

## Soft Delete

Never hard delete core entities.

Use:
is_archive = true

---

## Pagination

Allowed query params:
?page=1&limit=10

No other query params allowed.

Filters must go in request body.
