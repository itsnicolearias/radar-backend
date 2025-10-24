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
- **Swagger API Documentation**
- **Comprehensive test coverage with Jest**
- **ESLint and Prettier for code quality**
- **CI/CD pipeline with GitHub Actions**

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
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest
- **Code Quality**: ESLint + Prettier
- **Logging**: Morgan + Winston

## Project Structure

\`\`\`
src/
├── config/          # Configuration files (database, email, S3, Redis, Swagger)
├── interfaces/      # TypeScript interfaces and types
├── models/          # Sequelize models
├── migrations/      # Database migrations
├── controllers/     # Route controllers
├── services/        # Business logic
├── routes/          # API routes
├── schemas/         # Zod validation schemas
├── middlewares/     # Custom middleware
├── utils/           # Utility functions
├── tests/           # Integration tests
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
npm run migrations:run
\`\`\`

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript for production
- `npm start` - Start production server

### Database
- `npm run migrations:run` - Run all pending migrations
- `npm run migrations:delete` - Undo all migrations
- `npm run migrations:revert` - Undo last migration
- `npm run seed` - Run database seeders

### Code Quality
- `npm run lint` - Run ESLint and auto-fix issues
- `npm run format` - Format code with Prettier

### Testing
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## API Documentation

Interactive API documentation is available at:
\`\`\`
http://localhost:3000/api/docs
\`\`\`

The Swagger UI provides:
- Complete API endpoint documentation
- Request/response schemas
- Interactive API testing
- Authentication examples

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
- **connections** - Friend connections (status stored as VARCHAR)
- **messages** - Direct messages
- **notifications** - User notifications (type stored as VARCHAR)

**Note**: ENUMs are implemented as TypeScript enums for type safety, while database columns use VARCHAR to avoid database-level enum constraints.

## Testing

The project includes comprehensive integration tests covering:
- Authentication (register, login)
- Profile management
- Connection requests
- Message handling

Run tests with:
\`\`\`bash
npm test
\`\`\`

Tests use a separate test database and clean up after each test run.

## CI/CD

GitHub Actions workflow automatically:
1. Runs ESLint for code quality
2. Checks code formatting with Prettier
3. Compiles TypeScript
4. Runs database migrations
5. Executes all tests
6. Builds Docker image (on main branch)
7. Uploads coverage reports

## Docker

Build and run with Docker:
\`\`\`bash
docker build -t radar-backend .
docker run -p 3000:3000 --env-file .env radar-backend
\`\`\`

## Environment Variables

See `.env.example` for all required environment variables:

### Required
- `NODE_ENV` - Environment (development/test/production)
- `PORT` - Server port
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens

### Database
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `DB_HOST` - Database host
- `DB_PORT` - Database port

### AWS S3
- `AWS_REGION` - AWS region
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_S3_BUCKET` - S3 bucket name

### Email
- `EMAIL_HOST` - SMTP host
- `EMAIL_PORT` - SMTP port
- `EMAIL_USER` - Email username
- `EMAIL_PASS` - Email password
- `EMAIL_FROM` - From email address

### Optional
- `REDIS_URL` - Redis connection URL

## Code Quality

The project follows strict code quality standards:
- **TypeScript**: Full type safety with interfaces and types
- **ESLint**: Enforces coding standards and best practices
- **Prettier**: Consistent code formatting
- **Modular Architecture**: Separation of concerns (controllers, services, routes)
- **Error Handling**: Centralized error handling with Boom
- **Validation**: Input validation with Zod schemas

## Architecture Decisions

### Centralized Configuration
All environment variables are accessed through `src/config/config.ts` for consistency and maintainability.

### Interface Separation
TypeScript interfaces are organized in `src/interfaces/` for better code organization and reusability.

### TypeScript ENUMs over Database ENUMs
ENUMs are defined in TypeScript for type safety while using VARCHAR in the database to avoid migration complexity.

### Testing Strategy
Integration tests focus on API endpoints with real database interactions to ensure end-to-end functionality.

## License

ISC
