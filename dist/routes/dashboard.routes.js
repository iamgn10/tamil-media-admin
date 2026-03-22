"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const checkRole_middleware_1 = require("../middlewares/checkRole.middleware");
const router = (0, express_1.Router)();
const dashboardController = tsyringe_1.container.resolve(dashboard_controller_1.DashboardController);
const upload = (0, multer_1.default)();
/**
 * @swagger
 * /dashboard/upload-logo:
 *   post:
 *     tags: [Dashboard]
 *     summary: Upload a logo (header or footer)
 *     description: Uploads a logo image to Cloudflare R2 and saves its public URL with a specified type (header or footer)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: The logo image file to upload
 *               type:
 *                 type: string
 *                 enum: [header, footer]
 *                 description: Type of logo (header or footer)
 *     responses:
 *       201:
 *         description: Logo uploaded successfully
 *       400:
 *         description: Bad request (missing image or type)
 *       500:
 *         description: Internal server error
 */
router.post("/upload-logo", auth_middleware_1.Authenticated, (0, checkRole_middleware_1.canAccess)(['Super Admin', 'Site Admin']), upload.single('logo'), dashboardController.uploadLogo.bind(dashboardController));
/**
 * @swagger
 * /dashboard/get-logo:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get all logos
 *     description: Retrieves all logos (header and footer) from the database
 *     responses:
 *       200:
 *         description: Logos retrieved successfully
 *       404:
 *         description: No logos found
 *       500:
 *         description: Internal server error
 */
router.get("/get-logo", dashboardController.getLogo.bind(dashboardController));
/**
 * @swagger
 * /dashboard/data:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard data
 *     description: Retrieves dashboard statistics including total news, published news, today's news, and total drafts
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       404:
 *         description: Dashboard data not found
 *       500:
 *         description: Internal server error
 */
router.get("/data", auth_middleware_1.Authenticated, dashboardController.getDashboardData.bind(dashboardController));
/**
 * @swagger
 * /dashboard/data-by-user:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard data
 *     description: Retrieves dashboard statistics including total news, published news, today's news, and total drafts
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       404:
 *         description: Dashboard data not found
 *       500:
 *         description: Internal server error
 */
router.get("/data-by-user", auth_middleware_1.Authenticated, dashboardController.getDashboardDataOfUser.bind(dashboardController));
exports.default = router;
