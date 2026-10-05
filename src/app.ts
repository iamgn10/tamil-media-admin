import "@aikidosec/firewall";
import "reflect-metadata";
import express from 'express';
import { json } from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger';
import routes from './routes/index';
import connectToDatabase from './config/database';
import { errorHandler } from './middlewares/error.middleware';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import morganMiddleware from './middlewares/logger.middleware';
import cors from 'cors';
import { apiLimiter } from "./middlewares/rateLimit.middleware";
import connectDB from "./config/database";
import { CronService } from './services/cron.service';
import * as Zen from "@aikidosec/firewall";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Disable ETag generation to prevent 304 responses
app.set('etag', false);

// Trust proxy - Required for deployment behind load balancers/proxies
// This is essential for proper rate limiting and getting real client IPs
app.set('trust proxy', 1); // Trust first proxy

// CORS middleware
const corsOptions = {
  origin: '*', // Allow all origins or specify the frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

app.use(cors(corsOptions)); // Use CORS middleware

// Security middleware
app.use(helmet());

// Logging middleware (morgan integrated with winston Logger)
app.use(morganMiddleware);

// Request logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // Logs: :method :url :status :response-time ms
} else {
    app.use(morgan('combined')); // More detailed logging for production
}

//app.use(apiLimiter);

// We are bypassing MongoDB connection entirely since you are migrating to Supabase.
// connectDB().catch(err => {
//   console.error('Database connection failed:', err);
// });

// Middleware
app.use(json());

// Aikido Zen firewall middleware (rate limiting and user blocking)
Zen.addExpressMiddleware(app);

// Force Swagger to be available in production on Vercel so you can audit the API endpoints
app.use(process.env.SWAGGER_URL || '/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use(routes);

// Default route (optional)
app.get('/', (req, res) => {
  res.send('Welcome to the tamilmedia API - v1 ');
});

// Error handling middleware
app.use(errorHandler);

// Database connection disabled for Supabase migration
// connectDB().catch(err => {
//   console.error('Database connection failed:', err);
// });

// Start server locally (not on Vercel)
if (!process.env.VERCEL) {
  const cronService = new CronService();
  cronService.startScheduler();
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/api/v1`);
    console.log(`Swagger docs available at http://localhost:${PORT}${process.env.SWAGGER_URL || '/api-docs'}`);
  });
}

// Export the app for Vercel
export default app;