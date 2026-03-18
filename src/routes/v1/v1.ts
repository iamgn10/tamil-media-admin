import { Router } from 'express';
import authRoutes from '../auth.routes';
import userRoleRoutes from '../roles.routes';
import userRoutes from '../user.routes';
import keywordRoutes from '../keyword.routes';
import advertiesmentRoutes from '../advertiesment.routes';
import contentRoutes from '../content.routes';
import dashboardRoutes from '../dashboard.routes';
import mediaRoutes from '../media.routes';

export function getV1Routes(router: Router): void {
    
    
    // const router = Router();
    
    // Use Auth routes
    router.use('/auth', authRoutes);
    router.use('/user-role', userRoleRoutes);
    router.use('/user', userRoutes);
    router.use('/keyword', keywordRoutes);
    router.use('/advertiesment', advertiesmentRoutes);
    router.use('/content', contentRoutes);
    router.use('/dashboard', dashboardRoutes);
    router.use('/media', mediaRoutes);

    //return router;
}