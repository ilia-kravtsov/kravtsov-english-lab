# Kravtsov English Lab

Web application for learning English vocabulary with interactive practice modes.

## Project Purpose

This project is part of a final qualification work (ВКР) and focuses on:

> Comparative analysis of global state management approaches in React applications.

The application is implemented in two variants using different state managers:
- createGstore
- Zustand

The goal is to evaluate their effectiveness based on real application usage and collected metrics.

---

## Features

- User authentication (JWT)
- Vocabulary training system
- Multiple practice modes:
    - Typing
    - Recognition
    - Listening
    - Context
- Progress tracking
- UI with reusable components

---

## Practice Modes

- **Typing** — type the correct word
- **Recognition** — choose the correct answer
- **Listening** — listen and type
- **Context** — fill in the missing word

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Feature-Sliced Design (FSD)
- Zustand / createGstore (for comparison)

### Backend
- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication

---

## Testing

The project includes unit tests for:
- business logic
- hooks
- API layer
- UI components