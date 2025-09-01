# Liar Game Backend

This is the backend server for the Liar Game application.

## Structure

```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── routes/            # API route handlers
├── services/          # Business logic
└── .gitignore         # Git ignore rules
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your environment variables:
   ```
   PORT=3001
   NODE_ENV=development
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /health` - Health check
- `GET /api` - API information

## Development

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Notes

- Routes and services are currently empty and ready for implementation
- Database configuration will be added here to remove .env from frontend
- AI logic will be implemented in the services folder
