import { Router } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import bcrypt from 'bcrypt';
import { User } from '../db';
import { getUserRoutes } from './user';

export function getRoutes() {
    let router = Router();
    
    let userRoutes = getUserRoutes();
    
    
    if ('unprotected' in userRoutes) router.use('/user', userRoutes.unprotected);
    
    router.post('/auth', (req, res) => {
        if (!('email' in req.body && 'pass' in req.body)) {
            return res.json({ success: false, err: "Insufficient parameters." });
        }
        User.findOne({
            email: req.body.email
        }).catch((err) => {
            // console.error(err);
            res.json({ success: false, err });
        }).then((user) => {
            if (!user) {
                return res.json({ success: false, err: 'User not found.' });
            }
            
            if (bcrypt.compareSync(req.body.pass, user.pass)) {
                // console.log('ugh');
                let userObj = user.toObject();
                let token = jwt.sign(userObj, config.get('secret'), {
                    expiresIn: '1 day'
                });
                // console.log(token);
                res.json({ success: true, token, data: userObj });
            } else {
                res.json({ success: false, err: 'Invalid password.' });
            }
        });
    });
    
    router.post('/auth/refresh', (req, res) => {
        if (!req.body.token) return res.json({ success: false, err: 'No token given.' });
        jwt.verify(req.body.token, config.get('secret'), (err, dec) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, err: 'Failed to authenticate token.' });
            }
            User.findById(dec._id).catch((err) => {
                res.json({ success: false, err });
            }).then((user) => {
                let userObj = user.toObject();
                let token = jwt.sign(userObj, config.get('secret'), {
                    expiresIn: '1 day'
                });
                res.json({ success: true, token, data: userObj });
            });
        });
    });
    
    router.use((req, res, next) => {
        let token = req.body.token || req.query.token || req.headers['x-access-token'];
        
        if (!token) {
            return res.status(403).send({
                success: false,
                err: 'Protected routes require a token.'
            });
        }
        
        jwt.verify(token, config.get('secret'), (err, dec) => {
            if (err) {
                console.error(err);
                return res.json({
                    success: false,
                    err: 'Failed to authenticate token.'
                });
            }
            req.dec = dec;
            next();
        });
    });
    if ('protected' in userRoutes) router.use('/user', userRoutes.protected);
    
    return router;
}