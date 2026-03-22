"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const tsyringe_1 = require("tsyringe");
const advertiesment_controller_1 = require("../controllers/advertiesment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const checkRole_middleware_1 = require("../middlewares/checkRole.middleware");
const router = (0, express_1.Router)();
const advertiesmentController = tsyringe_1.container.resolve(advertiesment_controller_1.AdvertiesmentController);
const upload = (0, multer_1.default)();
/**
 * @swagger
 * /advertiesment/create:
 *   post:
 *     tags: [Advertiesment]
 *     summary: Create a new Advertiesment
 *     description: Upload a new advertisement with image and full details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - image
 *               - position
 *               - countries
 *               - isWebsiteHave
 *               - startDatetime
 *               - endDatetime
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               position:
 *                 type: string
 *                 enum: [Medium Rectangle, Large Rectangle, Leaderboard,Large Leaderboard,Half Page,Wide Skyscraper,Large Mobile Banner,Mobile Banner,Billboard,Skyscraper]
 *               countries:
 *                 type: string
 *                 description: JSON stringified array of country objects (e.g., `[{"code":"LK","name":"Sri Lanka"}]`)
 *               isWebsiteHave:
 *                 type: boolean
 *               adUrl:
 *                 type: string
 *               email:
 *                 type: string
 *               whatsappNo:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *               fbProfile:
 *                 type: string
 *               startDatetime:
 *                 type: string
 *                 format: date-time
 *               endDatetime:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [draft, published, expired, toPublish]
 *     responses:
 *       201:
 *         description: Advertiesment created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/create", auth_middleware_1.Authenticated, (0, checkRole_middleware_1.canAccess)(['Super Admin']), upload.single('image'), advertiesmentController.createAdvertiesment.bind(advertiesmentController));
/**
 * @swagger
 * /advertiesment/get-all:
 *   get:
 *     tags: [Advertiesment]
 *     summary: Get all Advertiesments
 *     description: Retrieve all Advertiesments
 *     responses:
 *       200:
 *         description: List of Advertiesments
 */
router.get('/get-all', advertiesmentController.getAllAdvertiesments.bind(advertiesmentController));
/**
 * @swagger
 * /advertiesment/get/{id}:
 *   get:
 *     tags: [Advertiesment]
 *     summary: Get a Advertiesment by ID
 *     description: Retrieve a specific Advertiesment by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Advertiesment
 *     responses:
 *       200:
 *         description: A single Advertiesment
 *       404:
 *         description: Advertiesment not found
 */
router.get('/get/:id', advertiesmentController.getAdvertiesmentById.bind(advertiesmentController));
/**
 * @swagger
 * /advertiesment/update/{id}:
 *   put:
 *     tags: [Advertiesment]
 *     summary: Update an existing Advertiesment
 *     description: Update an advertiesment by ID with optional new image and form data.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Advertiesment
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               position:
 *                 type: string
 *                 enum: [Medium Rectangle, Large Rectangle, Leaderboard, Large Leaderboard, Half Page, Wide Skyscraper, Large Mobile Banner, Mobile Banner, Billboard, Skyscraper]
 *               countries:
 *                 type: string
 *                 description: JSON stringified array of country objects (e.g., `[{"code":"LK","name":"Sri Lanka"}]`)
 *               isWebsiteHave:
 *                 type: boolean
 *               adUrl:
 *                 type: string
 *               email:
 *                 type: string
 *               whatsappNo:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *               fbProfile:
 *                 type: string
 *               startDatetime:
 *                 type: string
 *                 format: date-time
 *               endDatetime:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [draft, published, expired, toPublish]
 *     responses:
 *       200:
 *         description: Advertiesment updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Advertiesment not found
 */
router.put('/update/:id', auth_middleware_1.Authenticated, (0, checkRole_middleware_1.canAccess)(['Super Admin']), upload.single('image'), advertiesmentController.updateAdvertiesment.bind(advertiesmentController));
/**
 * @swagger
 * /advertiesment/delete/{id}:
 *   delete:
 *     tags: [Advertiesment]
 *     summary: Delete a Advertiesment
 *     description: Delete a Advertiesment by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Advertiesment
 *     responses:
 *       200:
 *         description: Advertiesment deleted successfully
 *       404:
 *         description: Advertiesment not found
 */
router.delete('/delete/:id', auth_middleware_1.Authenticated, (0, checkRole_middleware_1.canAccess)(['Super Admin']), advertiesmentController.deleteAdvertiesment.bind(advertiesmentController));
exports.default = router;
