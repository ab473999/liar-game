# Liar Game

A monorepo containing the frontend and backend for the Liar Game application.

## Structure

```
liar-game/
├── frontend/          # Next.js frontend application
├── backend/           # Node.js Express backend
├── package.json       # Monorepo configuration
└── README.md          # This file
```

## Quick Start

1. Install all dependencies:
   ```bash
   npm run install:all
   ```

2. Start both frontend and backend in development mode:
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend on http://localhost:3000
   - Backend on http://localhost:3001

## Individual Commands

### Frontend
- `npm run dev:frontend` - Start frontend development server
- `npm run build:frontend` - Build frontend for production
- `npm run start:frontend` - Start frontend production server

### Backend
- `npm run dev:backend` - Start backend development server
- `npm run build:backend` - Build backend for production
- `npm run start:backend` - Start backend production server

## Development

The frontend and backend are designed to work together:
- Frontend: Next.js application with game logic
- Backend: Express server for API endpoints, database operations, and AI services

## Notes

- Frontend contains the current game implementation
- Backend is set up with basic structure for future API endpoints and services
- Database configuration will be moved from frontend to backend
- AI logic will be implemented in the backend services
