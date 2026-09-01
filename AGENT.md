# AGENT GUIDE

## Development Rules

- Maintain clean architecture
- Avoid duplicate code
- Follow SRP
- Use helper layer for business logic

---

## Naming Convention

- camelCase → variables/functions
- UPPER_SNAKE_CASE → constants
- kebab-case → file names

---

## Validation

Every API must validate:

- body
- params
- query

---

## Response Format

{
message,
rid,
data
}
