# SCHOOL ACCESSORIES MART – ARCHITECTURE

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- bcrypt
- dotenv

---

## Architecture Layers

Client
→ Routes
→ Controllers
→ Services
→ Helpers
→ Models
→ PostgreSQL

---

## Folder Structure

/src
/config
/controllers
/helpers
/middleware
/models
/routes
/services
/utils
/migration-query

---

## Rules

- No business logic inside controllers
- All helpers return Promise
- Use async/await
- Use Sequelize ORM only
- Implement soft delete using is_archive

---

## Pagination Rule

Only:

- page
- limit

are allowed in query params.

All filters/sorting/search must go in request body.
