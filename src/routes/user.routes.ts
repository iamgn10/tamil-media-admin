import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/user.controller";
import { Authenticated } from '../middlewares/auth.middleware';
import { canAccess } from "../middlewares/checkRole.middleware";
import { authLimiter } from "../middlewares/rateLimit.middleware";
import { validateRequest } from "../middlewares/requestValidate.middleware";
import { UserRegisterSchema } from "../schemas/User.schema";

const router = Router();
const userController = container.resolve(UserController);

/**
 * @swagger
 * /user/create:
 *   post:
 *     tags: [User]
 *     summary: Register a new user
 *     description: Register a new user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               mobile:
 *                 type: string
 *               roleId:
 *                 type: string
 *               bio:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     fullname:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     mobile:
 *                       type: string
 *                     roleId:
 *                       type: string
 *                     roleName:
 *                       type: string
 *                     profilePicture:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     category:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.post("/create", Authenticated, 
    canAccess(['Super Admin', 'Site Admin']), 
    authLimiter, validateRequest(UserRegisterSchema), 
    userController.createUser.bind(userController));

/**
 * @swagger
 * /user/get-all:
 *   get:
 *     tags: [User]
 *     summary: Get all Users
 *     description: Retrieve all Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of Users
 */
router.get('/get-all', Authenticated, canAccess(['Super Admin','Site Admin']), userController.getAllUsers.bind(userController));

/**
 * @swagger
 * /user/get/{id}:
 *   get:
 *     tags: [User]
 *     summary: Get a User by ID
 *     description: Retrieve a specific User by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the User
 *     responses:
 *       200:
 *         description: A single User
 *       404:
 *         description: User not found
 */
router.get('/get/:id', Authenticated, canAccess(['Super Admin', 'Site Admin']), userController.getUserById.bind(userController));

/**
 * @swagger
 * /user/update/{id}:
 *   put:
 *     tags: [User]
 *     summary: Update a User
 *     description: Update a User by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               mobile:
 *                 type: string
 *               roleId:
 *                 type: string
 *               bio:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/update/:id', Authenticated, canAccess(['Super Admin', 'Site Admin']), userController.updateUser.bind(userController));

/**
 * @swagger
 * /user/delete/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Delete a User
 *     description: Delete a User by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the User
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/delete/:id', Authenticated, canAccess(['Super Admin']), userController.deleteUser.bind(userController));

export default router;