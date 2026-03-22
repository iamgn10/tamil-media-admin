"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const tsyringe_1 = require("tsyringe");
const media_controller_1 = require("../controllers/media.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const checkRole_middleware_1 = require("../middlewares/checkRole.middleware");
const router = (0, express_1.Router)();
const mediaController = tsyringe_1.container.resolve(media_controller_1.MediaController);
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
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
router.post("/create", auth_middleware_1.Authenticated, (0, checkRole_middleware_1.canAccess)(['Super Admin', 'Admin', 'Reporter']), upload.array('images', 10), mediaController.createMedia.bind(mediaController));
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
router.get('/get-all', auth_middleware_1.Authenticated, mediaController.getAllMedias.bind(mediaController));
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
router.get('/get/:id', auth_middleware_1.Authenticated, mediaController.getMediaById.bind(mediaController));
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
router.delete('/delete/:id', auth_middleware_1.Authenticated, mediaController.deleteMedia.bind(mediaController));
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
router.put('/remove-watermark/:id', auth_middleware_1.Authenticated, (0, checkRole_middleware_1.canAccess)(['Super Admin', 'Admin']), mediaController.removeWatermark.bind(mediaController));
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
router.put('/add-watermark/:id', auth_middleware_1.Authenticated, (0, checkRole_middleware_1.canAccess)(['Super Admin', 'Admin']), mediaController.addWatermark.bind(mediaController));
exports.default = router;
