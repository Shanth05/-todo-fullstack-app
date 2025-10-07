# 📝 Todo Task Manager

A modern, full-stack todo application built with React, Node.js, and TypeScript. Features a clean UI, real-time updates, and a robust backend API.

![Todo App Preview](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Todo+Task+Manager)

## ✨ Features

- 🎯 **Task Management**: Create, view, and complete tasks
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- ⚡ **Real-time Updates**: Instant feedback and notifications
- 🔍 **Real-time Validation**: Live task name availability checking
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations
- 🔒 **Type Safety**: Full TypeScript implementation
- 🧪 **Testing**: Comprehensive test coverage
- 🐳 **Docker Ready**: Easy deployment with Docker

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   React + TS    │◄──►│   Node.js + TS  │◄──►│   PostgreSQL    │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/-todo-fullstack-app.git
   cd -todo-fullstack-app
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

### Option 2: Local Development

#### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

#### Backend Setup
```bash
cd backend
npm install
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📋 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/tasks` | Get recent incomplete tasks | - |
| `GET` | `/tasks/check-availability` | Check task name availability | Query: `?title=taskname` |
| `POST` | `/tasks` | Create a new task | `{title: string, description?: string}` |
| `PUT` | `/tasks/:id/complete` | Mark task as completed | - |
| `GET` | `/tasks/:id` | Get task by ID | - |

### Example Requests

**Create a task:**
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn React", "description": "Complete React tutorial"}'
```

**Get tasks:**
```bash
curl http://localhost:3001/api/tasks
```

**Complete a task:**
```bash
curl -X PUT http://localhost:3001/api/tasks/1/complete
```

**Check task name availability:**
```bash
curl http://localhost:3001/api/tasks/check-availability?title=MyTask
```

## 🗄️ Database Schema

### Task Table
```sql
CREATE TABLE task (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes
- `idx_task_created_at` - For efficient ordering
- `idx_task_completed` - For filtering completed tasks

## 🧪 Testing

### Run All Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# E2E tests
npm run test:e2e
```

### Test Coverage
- **Backend**: Unit tests for controllers, services, and models
- **Frontend**: Component tests with React Testing Library
- **E2E**: End-to-end tests with Cypress

## 🛠️ Development

### Project Structure
```
-todo-fullstack-app/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── services/      # Business logic
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── config/        # Configuration
│   └── tests/             # Backend tests
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   └── styles/        # CSS files
│   └── public/           # Static assets
├── database/              # Database scripts
├── cypress/              # E2E tests
└── docker-compose.yml    # Docker configuration
```

### Available Scripts

#### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

#### Frontend
```bash
npm start            # Start development server
npm run build        # Build for production
npm test             # Run tests
npm run eject        # Eject from Create React App
```

## 🐳 Docker Configuration

### Development
```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Production
```bash
docker-compose up --build
```

### Services
- **Database**: PostgreSQL 15 with initialization script
- **Backend**: Node.js with hot reloading
- **Frontend**: React with development server

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todoapp
DB_USER=todo_user
DB_PASSWORD=todo_password
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 📦 Dependencies

### Backend
- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **helmet** - Security middleware
- **pg** - PostgreSQL client
- **express-validator** - Input validation
- **dotenv** - Environment variables

### Frontend
- **react** - UI library
- **react-dom** - React DOM bindings
- **react-toastify** - Toast notifications
- **typescript** - Type safety

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build

# Start production
npm start
```

### Docker Production
```bash
docker-compose -f docker-compose.yml up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill processes on ports 3000 and 3001
lsof -ti:3000,3001 | xargs kill -9
```

**Database connection issues:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres
```

**Frontend build issues:**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/-todo-fullstack-app/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend
- PostgreSQL for reliable data storage
- Docker for containerization
- All open-source contributors

---

**Happy Coding! 🎉**