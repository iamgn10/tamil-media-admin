import { Router } from "express";
import { container } from "tsyringe";
import { DashboardController } from "../controllers/dashboard.controller";
import { Authenticated } from '../middlewares/auth.middleware';
import multer from "multer";
import { canAccess } from "../middlewares/checkRole.middleware";

const router = Router();
const dashboardController = container.resolve(DashboardController);

const upload = multer();

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
router.post("/upload-logo", Authenticated, canAccess(['Super Admin', 'Site Admin']), upload.single('logo'), dashboardController.uploadLogo.bind(dashboardController));

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
router.get("/data", Authenticated, dashboardController.getDashboardData.bind(dashboardController));
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
router.get("/data-by-user", Authenticated, dashboardController.getDashboardDataOfUser.bind(dashboardController));



export default router;