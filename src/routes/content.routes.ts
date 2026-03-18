import { Router } from "express";
import multer from "multer";
import { container } from "tsyringe";
import { ContentController } from "../controllers/content.controller";
import { Authenticated } from '../middlewares/auth.middleware';
import { canAccess } from "../middlewares/checkRole.middleware";

const router = Router();
const contentController = container.resolve(ContentController);

const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /content/create:
 *   post:
 *     tags: [Content]
 *     summary: Create a Content
 *     description: Create a new Content with image upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - headline1
 *               - headline2
 *               - seoTitle
 *               - url
 *               - content
 *               - author
 *               - provinces
 *               - status
 *             properties:
 *               headline1:
 *                 type: string
 *               headline2:
 *                 type: string
 *               headline3:
 *                 type: string
 *               seoTitle:
 *                 type: string
 *               url:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               category:
 *                 type: string
 *               keywords:
 *                 type: string
 *               provinces:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Draft, Published, Canceled]
 *               isFeatured:
 *                 type: boolean
 *               isSpecial:
 *                 type: boolean
 *               isBreaking:
 *                 type: boolean
 *               isShownOnHome:
 *                 type: boolean
 *               scheduledPublishDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Content created successfully
 */
router.post("/create", Authenticated, canAccess(['Super Admin', 'Site Admin', 'Reporter']), upload.single('image'), contentController.createContent.bind(contentController));

/**
 * @swagger
 * /content/get-all-with-pagination:
 *   get:
 *     tags: [Content]
 *     summary: Get all Contents with pagination
 *     description: Retrieve all Contents with pagination support
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated list of Contents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     contents:
 *                       type: array
 *                       items:
 *                         type: object
 *                     total:
 *                       type: integer
 *                       description: Total number of contents
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages
 *                     currentPage:
 *                       type: integer
 *                       description: Current page number
 */
router.get('/get-all-with-pagination', contentController.getAllContents.bind(contentController));

/**
 * @swagger
 * /content/all:
 *   get:
 *     tags: [Content]
 *     summary: Get all Contents with pagination
 *     description: Retrieve all Contents with pagination. Returns total, totalPages, and currentPage
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated list of Contents with metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     contents:
 *                       type: array
 *                       items:
 *                         type: object
 *                     total:
 *                       type: integer
 *                       description: Total number of contents
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages
 *                     currentPage:
 *                       type: integer
 *                       description: Current page number
 */
router.get('/all', contentController.getAllContent.bind(contentController));

/**
 * @swagger
 * /content/all-by-user:
 *   get:
 *     tags: [Content]
 *     summary: Get all Contents of authenticated user with pagination
 *     description: Retrieve all Contents created by the authenticated user with pagination. Returns total, totalPages, and currentPage
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated list of user's Contents with metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     contents:
 *                       type: array
 *                       items:
 *                         type: object
 *                     total:
 *                       type: integer
 *                       description: Total number of user's contents
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages
 *                     currentPage:
 *                       type: integer
 *                       description: Current page number
 */
router.get('/all-by-user', Authenticated, contentController.getAllContentOfUser.bind(contentController));

/**
 * @swagger
 * /content/featured-and-special-and-breaking:
 *   get:
 *     tags: [Content]
 *     summary: Get Featured and Special Contents
 *     description: Retrieve contents that are marked as featured or special
 *     responses:
 *       200:
 *         description: List of Featured and Special Contents
 */
router.get('/featured-and-special-and-breaking', contentController.getSpecialContents_and_FeaturedContents_and_Breaking.bind(contentController));

/**
 * @swagger
 * /content/get/{id}:
 *   get:
 *     tags: [Content]
 *     summary: Get a Content by ID
 *     description: Retrieve a specific Content by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Content
 *     responses:
 *       200:
 *         description: A single Content
 *       404:
 *         description: Content not found
 */
router.get('/get/:id', contentController.getContentById.bind(contentController));

/**
 * @swagger
 * /content/update/{id}:
 *   put:
 *     tags: [Content]
 *     summary: Update a Content
 *     description: Update a Content by ID with optional image upload
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Content
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               headline1:
 *                 type: string
 *               headline2:
 *                 type: string
 *               headline3:
 *                 type: string
 *               seoTitle:
 *                 type: string
 *               url:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               category:
 *                 type: string
 *               keywords:
 *                 type: string
 *               provinces:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Draft, Published, Canceled]
 *               isFeatured:
 *                 type: boolean
 *               isSpecial:
 *                 type: boolean
 *               isBreaking:
 *                 type: boolean
 *               isShownOnHome:
 *                 type: boolean
 *               scheduledPublishDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Content updated successfully
 *       404:
 *         description: Content not found
 */

router.put('/update/:id', Authenticated, canAccess(['Super Admin', 'Site Admin', 'Reporter']), upload.single('image'), contentController.updateContent.bind(contentController));

/**
 * @swagger
 * /content/delete/{id}:
 *   delete:
 *     tags: [Content]
 *     summary: Delete a Content
 *     description: Delete a Content by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Content
 *     responses:
 *       200:
 *         description: Content deleted successfully
 *       404:
 *         description: Content not found
 */
router.delete('/delete/:id', Authenticated, canAccess(['Super Admin', 'Site Admin']), contentController.deleteContent.bind(contentController));

/**
 * @swagger
 * /content/filter-content:
 *   get:
 *     tags: [Content]
 *     summary: Filter Content
 *     description: Get filtered contents with pagination and optional filters
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: headline
 *         schema:
 *           type: string
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: roleNo
 *         schema:
 *           type: string
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Filtered content list
 */
router.get('/filter-content', contentController.getFilteredContent.bind(contentController));

/**
 * @swagger
 * /content/status-change/{id}:
 *   put:
 *     tags: [Content]
 *     summary: Change Content Status
 *     description: Change the status of a content by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Draft, Published, Canceled]
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.put('/status-change/:id', Authenticated, canAccess(['Super Admin', 'Site Admin']), contentController.changeContentStatus.bind(contentController));

/**
 * @swagger
 * /content/by-url/{url}:
 *   get:
 *     tags: [Content]
 *     summary: Get Contents by URL
 *     description: Retrieve multiple contents using URL
 *     parameters:
 *       - in: path
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contents fetched successfully
 */
router.get('/by-url/:url', contentController.getContentsByUrl.bind(contentController));

/**
 * @swagger
 * /content/single-url/{url}:
 *   get:
 *     tags: [Content]
 *     summary: Get Single Content by URL
 *     description: Retrieve single content using URL
 *     parameters:
 *       - in: path
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content fetched successfully
 */
router.get('/single-url/:url', contentController.getSingleContentByUrl.bind(contentController));

/**
 * @swagger
 * /content/keyword:
 *   post:
 *     tags: [Content]
 *     summary: Get Contents by Keyword
 *     description: Retrieve contents using a keyword
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - keyword
 *             properties:
 *               keyword:
 *                 type: string
 *                 example: technology
 *     responses:
 *       200:
 *         description: Contents fetched successfully
 */
router.post('/keyword', contentController.getContentByKeyword.bind(contentController));

/**
 * @swagger
 * /content/upload-rich-text:
 *   post:
 *     tags: [Content]
 *     summary: Upload Rich Text Image
 *     description: Upload images for rich text content
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
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 */
router.post('/upload-rich-text', Authenticated, canAccess(['Super Admin', 'Site Admin']), upload.array('images'), contentController.uploadRichTextImage.bind(contentController));

/** 
 * Get contents by category
 * @swagger
 * /content/by-category/{category}:
 *   get:
 *     tags: [Content]
 *     summary: Get Contents by Category
 *     description: Retrieve multiple contents using category
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contents fetched successfully
*/  

router.get('/by-category/:category', contentController.getContentsByCategory.bind(contentController));


export default router;