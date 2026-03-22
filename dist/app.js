"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./config/swagger"));
const index_1 = __importDefault(require("./routes/index"));
const error_middleware_1 = require("./middlewares/error.middleware");
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const logger_middleware_1 = __importDefault(require("./middlewares/logger.middleware"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./config/database"));
const cron_service_1 = require("./services/cron.service");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
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
app.use((0, cors_1.default)(corsOptions)); // Use CORS middleware
// Security middleware
app.use((0, helmet_1.default)());
// Logging middleware (morgan integrated with winston Logger)
app.use(logger_middleware_1.default);
// Request logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev')); // Logs: :method :url :status :response-time ms
}
else {
    app.use((0, morgan_1.default)('combined')); // More detailed logging for production
}
//app.use(apiLimiter);
// Middleware
app.use((0, body_parser_1.json)());
if (process.env.NODE_ENV === 'development') {
    app.use(process.env.SWAGGER_URL || '/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
}
// Routes
app.use(index_1.default);
// Default route (optional)
app.get('', (req, res) => {
    res.send('Welcome to the tamilmedia API - v1 ');
});
// Error handling middleware
app.use(error_middleware_1.errorHandler);
// Export the app for Vercel
exports.default = app;
// Start server locally (not on Vercel)
if (!process.env.VERCEL) {
    (0, database_1.default)()
        .then(() => {
        const cronService = new cron_service_1.CronService();
        cronService.startScheduler();
        app.listen(PORT, () => {
            console.log('Connected to database');
            console.log(`Server is running on http://localhost:${PORT}/api/v1`);
            console.log(`Swagger docs available at http://localhost:${PORT}${process.env.SWAGGER_URL || '/api-docs'}`);
        });
    })
        .catch(err => {
        console.error('Database connection failed:', err);
    });
}
