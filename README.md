# README.md

# Backend API Server

A robust Node.js Express API server with authentication and user management, built using TypeScript, MongoDB, and Mongoose ODM.

## Features

- **Authentication**
  - JWT-based authentication
  - Session management
  - Login/Logout functionality
  - Role-based access control
- **User Management**

  - User registration and profile management
  - Role assignment and management
  - Input validation using Joi and Zod
  - Password hashing with bcrypt

- **Database**

  - MongoDB with Mongoose ODM
  - Database connection management
  - Seeders for testing data

- **Security**

  - Helmet for security headers
  - CORS configuration
  - Rate limiting
  - XSS prevention
  - Password hashing with bcrypt
  - JWT token validation

- **Documentation**

  - Swagger API documentation
  - Detailed API specifications

- **Logging**

  - Winston logger implementation
  - Daily rotating log files
  - HTTP request logging with Morgan

- **Development Tools**
  - Dependency injection with TSyringe
  - Code generators for models, controllers, services, etc.
  - Docker support

## Project Structure

```
backend-api-server/
├── src/
│   ├── config/          # Configuration files
│   │   ├── scripts/     # Code generation scripts
│   │   ├── app.config.ts
│   │   ├── database.ts
│   │   └── swagger.ts
│   ├── controllers/     # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   └── userRole.controller.ts
│   ├── middlewares/     # Custom middleware
│   │   ├── auth.middleware.ts
│   │   ├── checkRole.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── logger.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   ├── requestValidate.middleware.ts
│   │   └── xssPrevent.middleware.ts
│   ├── models/          # Mongoose models
│   │   ├── role.model.ts
│   │   ├── user.model.ts
│   │   └── userLoginSession.model.ts
│   ├── repositories/    # Data access layer
│   │   ├── auth.repository.ts
│   │   ├── user.repository.ts
│   │   └── userRole.repository.ts
│   ├── routes/          # API routes
│   │   ├── v1/
│   │   ├── auth.routes.ts
│   │   ├── roles.routes.ts
│   │   ├── user.routes.ts
│   │   └── index.ts
│   ├── schemas/         # Validation schemas
│   │   └── User.schema.ts
│   ├── services/        # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   └── userRole.service.ts
│   ├── seeders/         # Database seeders
│   │   ├── userrole.ts
│   │   └── users.ts
│   ├── tests/           # Test files
│   │   ├── integration/
│   │   ├── unit/
│   │   └── utils/
│   ├── types/           # TypeScript types
│   │   ├── repo/        # Repository interfaces
│   │   ├── user/        # User types
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── AppError.ts
│   │   ├── jwt.ts
│   │   └── logger.ts
│   ├── enums/           # Enumerations
│   │   └── UserRoles.enum.ts
│   ├── app.ts           # Application entry point
│   └── di-container.ts  # Dependency injection container
├── logs/                # Application logs
├── recommendations/     # Recommendation files
├── .env                 # Environment variables
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── docker-compose.yml   # Docker compose configuration
├── Dockerfile           # Docker configuration
└── .gitignore           # Git ignored files
```

## Prerequisites

- Node.js >= 14
- MongoDB >= 4.4
- npm or yarn

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd backend-api-server

   ```

2. Install dependencies

   ```bash
   npm install

   ```

3. Configure environment

   ```bash
   cp .env.example .env

   ```

4. Start MongoDB service (if running locally)

5. Run seeders (optional)

   ```bash
   npm run seed:specific

   ```

6. Start server
   ```bash
   npm run dev
   ```

## Available Scripts

- **`npm run dev`**: Start the development server with hot-reload using nodemon.
- **`npm start`**: Build and start the production server.
- **`npm run build`**: Compile TypeScript to JavaScript.
- **`npm run seed:specific`**: Run specific database seeders.
- **`npm run make:model`**: Generate a new Mongoose model.
- **`npm run make:seeder`**: Generate a new database seeder.
- **`npm run make:route`**: Generate a new route file.
- **`npm run make:controller`**: Generate a new controller.
- **`npm run make:service`**: Generate a new service.
- **`npm run make:repo`**: Generate a new repository.

## API Documentation

- Access the Swagger documentation at [http://localhost:3000/api-docs](http://localhost:3000/api-docs) when running in development mode.

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/your-database-name

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

# Client Configuration
CLIENT_ORIGIN=http://localhost:3000

# Other configurations as needed
```

## Docker Support

The project includes Docker configuration for easy deployment:

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in production mode
docker-compose -f docker-compose.prod.yml up --build
```

## Contributing

Contributions are welcome! If you have any suggestions, improvements, or bug fixes, feel free to open an issue or create a pull request.

- **Create a feature branch**.
- **Commit your changes**.
- **Push to the branch**.
- **Create a Pull Request**.

#### Author

- GitHub: [https://github.com/sajithnsilvame](https://github.com/sajithnsilvame)
- Twitter: [https://x.com/SajithNSilvame](https://x.com/SajithNSilvame)
- LinkedIn: [https://www.linkedin.com/in/sajith-nishantha-silva](https://www.linkedin.com/in/sajith-nishantha-silva)
- Facebook: [https://www.facebook.com/sajithnsilva.me](https://www.facebook.com/sajithnsilva.me)
- Instagram: [https://www.instagram.com/sajithnsilvame](https://www.instagram.com/sajithnsilvame)

#### License

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
