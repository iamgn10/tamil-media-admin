"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const tsyringe_1 = require("tsyringe");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rateLimit_middleware_1 = require("../middlewares/rateLimit.middleware");
const router = (0, express_1.Router)();
const authController = tsyringe_1.container.resolve(auth_controller_1.default);
// /**
//  * @swagger
//  * /auth/register:
//  *   post:
//  *     tags: [Auth]
//  *     summary: Register a new user
//  *     description: Register a new user with default role as 'user'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               fullname:
//  *                 type: string
//  *               username:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *               mobile:
//  *                 type: string
//  *               roleId:
//  *                 type: string
//  *               bio:
//  *                 type: string
//  *               profilePicture:
//  *                 type: string
//  *               category:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *     responses:
//  *       201:
//  *         description: User registered successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: string
//  *                     fullname:
//  *                       type: string
//  *                     email:
//  *                       type: string
//  *                     username:
//  *                       type: string
//  *                     mobile:
//  *                       type: string
//  *                     roleId:
//  *                       type: string
//  *                     roleName:
//  *                       type: string
//  *                     profilePicture:
//  *                       type: string
//  *                     bio:
//  *                       type: string
//  *                     category:
//  *                       type: array
//  *                       items:
//  *                         type: string
//  */
// router.post('/register', Authenticated, canAccess(['Site Admin']), authLimiter, validateRequest(UserRegisterSchema), authController.register.bind(authController));
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     description: Authenticate user and return JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "siteadmin@example.com"
 *               password:
 *                 type: string
 *                 example: "siteadmin123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         email:
 *                           type: string
 *                         username:
 *                           type: string
 *                         mobile:
 *                           type: string
 *                         roleId:
 *                            type: number
 */
router.post('/login', rateLimit_middleware_1.authLimiter, authController.login.bind(authController));
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 *     description: Logout the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', auth_middleware_1.Authenticated, authController.logout.bind(authController));
/**
 * @swagger
 * /auth/user:
 *   get:
 *     tags: [Auth]
 *     summary: Get authenticated user details
 *     description: Returns the current authenticated user's information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
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
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     roleId:
 *                       type: string
 */
router.get('/user', auth_middleware_1.Authenticated, authController.getAuthUser.bind(authController));
// /**
//  * @swagger
//  * /auth/user-list:
//  *   get:
//  *     tags: [User]
//  *     summary: Get all users
//  *     description: Get all users
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Get all users
//  */
// router.get('/user-list', Authenticated, canAccess(['Site Admin']), authController.getAllUsers.bind(authController));
/**
 * @swagger
 * /auth/update-user:
 *   put:
 *     tags: [Auth]
 *     summary: Update authenticated user details
 *     description: Update the current authenticated user's information
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
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
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
 */
router.put('/update-user', auth_middleware_1.Authenticated, authController.updateUser.bind(authController));
/**
 * @swagger
 * /auth/update-password:
 *   put:
 *     tags: [Auth]
 *     summary: Update user password
 *     description: Update authenticated user's password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "currentpass123"
 *               newPassword:
 *                 type: string
 *                 example: "newpass123"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.put('/update-password', auth_middleware_1.Authenticated, authController.updatePassword.bind(authController));
exports.default = router;
