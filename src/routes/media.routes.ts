import { Router } from "express";
import multer from 'multer';
import { container } from "tsyringe";
import { MediaController } from "../controllers/media.controller";
import { Authenticated } from '../middlewares/auth.middleware';
import { canAccess } from "../middlewares/checkRole.middleware";

const router = Router();
const mediaController = container.resolve(MediaController);
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /media/create:
 *   post:
 *     tags: [Media]
 *     summary: Create a Media
 *     description: Create a new Media
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Media files to upload
 *     responses:
 *       200:
 *         description: Media created successfully
 */
router.post("/create", Authenticated, canAccess(['Super Admin', 'Admin', 'Reporter']), upload.array('images', 10), mediaController.createMedia.bind(mediaController));

/**
 * @swagger
 * /media/get-all:
 *   get:
 *     tags: [Media]
 *     summary: Get all Medias
 *     description: Retrieve all Medias
 *     responses:
 *       200:
 *         description: List of Medias
 */
router.get('/get-all', Authenticated, mediaController.getAllMedias.bind(mediaController));

/**
 * @swagger
 * /media/get/{id}:
 *   get:
 *     tags: [Media]
 *     summary: Get a Media by ID
 *     description: Retrieve a specific Media by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Media
 *     responses:
 *       200:
 *         description: A single Media
 *       404:
 *         description: Media not found
 */
router.get('/get/:id', Authenticated, mediaController.getMediaById.bind(mediaController));

/**
 * @swagger
 * /media/delete/{id}:
 *   delete:
 *     tags: [Media]
 *     summary: Delete a Media
 *     description: Delete a Media by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Media
 *     responses:
 *       200:
 *         description: Media deleted successfully
 *       404:
 *         description: Media not found
 */
router.delete('/delete/:id', Authenticated, mediaController.deleteMedia.bind(mediaController));

/**
 * @swagger
 * /media/remove-watermark/{id}:
 *   put:
 *     tags: [Media]
 *     summary: Remove watermark from media image
 *     description: Remove watermark by using stored original image
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the media
 *     responses:
 *       200:
 *         description: Watermark removed successfully
 *       404:
 *         description: Media not found or original image not available
 */
router.put('/remove-watermark/:id', Authenticated, canAccess(['Super Admin', 'Admin']), mediaController.removeWatermark.bind(mediaController));

/**
 * @swagger
 * /media/add-watermark/{id}:
 *   put:
 *     tags: [Media]
 *     summary: Add watermark to media image
 *     description: Add watermark by processing stored original image
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the media
 *     responses:
 *       200:
 *         description: Watermark added successfully
 *       404:
 *         description: Media not found or original image not available
 */
router.put('/add-watermark/:id', Authenticated, canAccess(['Super Admin', 'Admin']), mediaController.addWatermark.bind(mediaController));

export default router;