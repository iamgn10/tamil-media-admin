import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { container } from 'tsyringe';
import { Authenticated } from '../middlewares/auth.middleware';
import { authLimiter } from '../middlewares/rateLimit.middleware';
import { validateRequest } from '../middlewares/requestValidate.middleware';
import { UserRegisterSchema } from '../schemas/User.schema';
import { canAccess } from '../middlewares/checkRole.middleware';

const router = Router();
const authController = container.resolve(AuthController);

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
router.post('/login', authLimiter, authController.login.bind(authController));

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
router.post('/logout', Authenticated, authController.logout.bind(authController));

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
router.get('/user', Authenticated, authController.getAuthUser.bind(authController));

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
router.put('/update-user', Authenticated, authController.updateUser.bind(authController));

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
router.put('/update-password', Authenticated, authController.updatePassword.bind(authController));



export default router;