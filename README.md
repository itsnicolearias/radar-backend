# Radar Backend API

A social networking backend API built with Node.js, TypeScript, Express, Sequelize, PostgreSQL, and Socket.io.

## Features

- User authentication with JWT
- User profiles with customizable settings
- Connection requests (friend system)
- Real-time messaging with Socket.io
- Notifications system
- Location tracking
- AWS S3 integration for file uploads
- Email notifications with Nodemailer
- Redis caching (optional)

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express
- **Database**: PostgreSQL with PostGIS
- **ORM**: Sequelize
- **Real-time**: Socket.io
- **Validation**: Zod
- **Authentication**: JWT + bcrypt
- **Cloud Storage**: AWS S3
- **Email**: Nodemailer
- **Cache**: Redis (optional)

## Project Structure

\`\`\`
src/
├── config/          # Configuration files (database, email, S3, Redis)
├── models/          # Sequelize models
├── migrations/      # Database migrations
├── controllers/     # Route controllers
├── services/        # Business logic
├── routes/          # API routes
├── schemas/         # Zod validation schemas
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
\`\`\`

## Installation

1. Clone the repository
2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Copy `.env.example` to `.env` and configure your environment variables

4. Run migrations:
\`\`\`bash
npm run migrate
\`\`\`

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `PATCH /api/users/:id/location` - Update user location

### Profiles
- `GET /api/profiles/:userId` - Get user profile
- `POST /api/profiles` - Create profile
- `PATCH /api/profiles/:userId` - Update profile
- `DELETE /api/profiles/:userId` - Delete profile

### Connections
- `POST /api/connections` - Send connection request
- `GET /api/connections` - Get all connections
- `PATCH /api/connections/:connectionId` - Accept/reject connection
- `DELETE /api/connections/:connectionId` - Delete connection

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/:userId` - Get messages with user
- `PATCH /api/messages/read` - Mark messages as read
- `GET /api/messages/unread/count` - Get unread message count

### Notifications
- `GET /api/notifications` - Get all notifications
- `PATCH /api/notifications/read` - Mark notifications as read
- `GET /api/notifications/unread/count` - Get unread notification count
- `DELETE /api/notifications/:notificationId` - Delete notification

## Socket.io Events

### Client to Server
- `update-location` - Update user location
- `send-message` - Send real-time message
- `connection-request` - Send connection request
- `connection-accepted` - Accept connection
- `typing` - User is typing
- `stop-typing` - User stopped typing

### Server to Client
- `location-updated` - Location was updated
- `new-message` - New message received
- `new-connection-request` - New connection request
- `connection-request-accepted` - Connection accepted
- `user-typing` - User is typing
- `user-stopped-typing` - User stopped typing

## Database Schema

- **users** - User authentication and basic info
- **profiles** - User profiles and preferences
- **connections** - Friend connections
- **messages** - Direct messages
- **notifications** - User notifications

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration

## Environment Variables

See `.env.example` for all required environment variables.

## License

ISC
