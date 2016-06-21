import { Router } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import { getUserRoutes } from './user';

export function getRoutes() {
    let router = Router();
    
    let userRoutes = getUserRoutes();
    
    
    router.use('/api', userRoutes.unprotected);
    
    router.use((req, res, next) => {
        let token = req.body.token || req.query.token || req.headers['x-access-token'];
        
        if (!token) {
            return res.status(403).send({
                success: false,
                message: 'Protected routes require a token.'
            });
        }
        
        jwt.verify(token, )
    });
}