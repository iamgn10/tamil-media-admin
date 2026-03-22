"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const checkRole_middleware_1 = require("../middlewares/checkRole.middleware");
const rateLimit_middleware_1 = require("../middlewares/rateLimit.middleware");
const requestValidate_middleware_1 = require("../middlewares/requestValidate.middleware");
const User_schema_1 = require("../schemas/User.schema");
const router = (0, express_1.Router)();
const userController = tsyringe_1.container.resolve(user_controller_1.UserController);
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
router.post("/create", auth_middleware_1.Authenticated, (0, checkRole_middleware_1.canAccess)(['Super Admin', 'Site Admin']), rateLimit_middleware_1.authLimiter, (0, requestValidate_middleware_1.validateRequest)(User_schema_1.UserRegisterSchema), userController.createUser.bind(userController));
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
router.get('/get-all', auth_middleware_1.Authenticated, (0, checkRole_middleware_1.canAccess)(['Super Admin', 'Site Admin']), userController.getAllUsers.bind(userController));
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
router.get('/get/:id', auth_middleware_1.Authenticated, (0, checkRole_middleware_1.canAccess)(['Super Admin', 'Site Admin']), userController.getUserById.bind(userController));
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
router.put('/update/:id', auth_middleware_1.Authenticated, (0, checkRole_middleware_1.canAccess)(['Super Admin', 'Site Admin']), userController.updateUser.bind(userController));
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
router.delete('/delete/:id', auth_middleware_1.Authenticated, (0, checkRole_middleware_1.canAccess)(['Super Admin']), userController.deleteUser.bind(userController));
exports.default = router;
