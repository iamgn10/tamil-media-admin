"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const keyword_controller_1 = require("../controllers/keyword.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const checkRole_middleware_1 = require("../middlewares/checkRole.middleware");
const router = (0, express_1.Router)();
const keywordController = tsyringe_1.container.resolve(keyword_controller_1.KeywordController);
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
router.post("/create", auth_middleware_1.Authenticated, (0, checkRole_middleware_1.canAccess)(['Super Admin', 'Site Admin']), keywordController.createKeyword.bind(keywordController));
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
router.get('/get-all', auth_middleware_1.Authenticated, keywordController.getAllKeywords.bind(keywordController));
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
router.get('/get/:id', auth_middleware_1.Authenticated, keywordController.getKeywordById.bind(keywordController));
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
router.put('/update/:id', auth_middleware_1.Authenticated, (0, checkRole_middleware_1.canAccess)(['Super Admin', 'Site Admin']), keywordController.updateKeyword.bind(keywordController));
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
router.delete('/delete/:id', auth_middleware_1.Authenticated, (0, checkRole_middleware_1.canAccess)(['Super Admin', 'Site Admin']), keywordController.deleteKeyword.bind(keywordController));
exports.default = router;
