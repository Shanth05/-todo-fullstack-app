# Todo Task Web Application

A full-stack to-do task web application built with React, Node.js/Express, and PostgreSQL.

## Features

- Create to-do tasks with title and description
- View the 5 most recent tasks
- Mark tasks as completed (completed tasks are hidden)
- Clean, modern UI
- Fully containerized with Docker

## Architecture

- **Frontend**: React SPA (Port 3000)
- **Backend**: Node.js/Express REST API (Port 3001)
- **Database**: PostgreSQL (Port 5432)

## Prerequisites

- Docker
- Docker Compose
- Linux dev environment with Bash

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/Shanth05/-todo-fullstack-app.git
cd -todo-fullstack-app
```

2. Start all services:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: localhost:5432

## API Endpoints

- `GET /api/tasks` - Get the 5 most recent incomplete tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id/complete` - Mark a task as completed

## Development

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

## Testing

Run all tests:
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# E2E tests
npm run test:e2e
```

## Database Schema

The `task` table includes:
- `id` (Primary Key)
- `title` (VARCHAR)
- `description` (TEXT)
- `completed` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Tech Stack

- **Frontend**: React, TypeScript, CSS3
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **Testing**: Jest, React Testing Library, Cypress
- **Containerization**: Docker, Docker Compose