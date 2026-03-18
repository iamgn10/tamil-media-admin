import { Router } from "express";
import { container } from "tsyringe";
import { KeywordController } from "../controllers/keyword.controller";
import { Authenticated } from '../middlewares/auth.middleware';
import { canAccess } from "../middlewares/checkRole.middleware";

const router = Router();
const keywordController = container.resolve(KeywordController);

/**
 * @swagger
 * /keyword/create:
 *   post:
 *     tags: [Keyword]
 *     summary: Create a Keyword
 *     description: Create a new Keyword
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keyword:
 *                 type: string
 *                 example: "Example keyword"
 *               category:
 *                 type: string
 *                 example: "Example category"
 *     responses:
 *       200:
 *         description: Keyword created successfully
 */
router.post("/create", Authenticated, canAccess(['Super Admin', 'Site Admin']), keywordController.createKeyword.bind(keywordController));

/**
 * @swagger
 * /keyword/get-all:
 *   get:
 *     tags: [Keyword]
 *     summary: Get all Keywords
 *     description: Retrieve all Keywords
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of Keywords
 */
router.get('/get-all', Authenticated, keywordController.getAllKeywords.bind(keywordController));

/**
 * @swagger
 * /keyword/get/{id}:
 *   get:
 *     tags: [Keyword]
 *     summary: Get a Keyword by ID
 *     description: Retrieve a specific Keyword by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Keyword
 *     responses:
 *       200:
 *         description: A single Keyword
 *       404:
 *         description: Keyword not found
 */
router.get('/get/:id', Authenticated, keywordController.getKeywordById.bind(keywordController));

/**
 * @swagger
 * /keyword/update/{id}:
 *   put:
 *     tags: [Keyword]
 *     summary: Update a Keyword
 *     description: Update a Keyword by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Keyword
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keyword:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Keyword updated successfully
 *       404:
 *         description: Keyword not found
 */
router.put('/update/:id', Authenticated, canAccess(['Super Admin','Site Admin']), keywordController.updateKeyword.bind(keywordController));

/**
 * @swagger
 * /keyword/delete/{id}:
 *   delete:
 *     tags: [Keyword]
 *     summary: Delete a Keyword
 *     description: Delete a Keyword by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Keyword
 *     responses:
 *       200:
 *         description: Keyword deleted successfully
 *       404:
 *         description: Keyword not found
 */
router.delete('/delete/:id', Authenticated, canAccess(['Super Admin','Site Admin']), keywordController.deleteKeyword.bind(keywordController));

export default router;