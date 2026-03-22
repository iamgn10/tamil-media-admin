"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: process.env.APP_NAME || "API",
            version: "1.0.0",
            description: `${process.env.APP_NAME || "Demo"} documentation that provides information about the API endpoints, request parameters, and response formats.`,
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 8000}/api/v1`,
                description: "Local development server",
            },
            {
                url: "https://api.tamilmedia.lk/api/v1",
                description: "production server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        // security: [
        //   {
        //     bearerAuth: [],
        //   },
        // ],
    },
    apis: ["./src/routes/*.ts"], // Adjust the path to your route files
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
