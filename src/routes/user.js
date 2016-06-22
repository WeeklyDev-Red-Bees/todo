import { Router } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../db';

// function getUnprotected() {
//     let router = Router();
    
    
    
//     return router;
// }

function getProtected() {
    let router = Router();
    
    // router.route('/:id')
    router.get('/', (req, res) => {
        console.log(req.dec);
        User.findById(req.dec._id).catch((err) => {
            res.json({ success: false, err });
        }).then((user) => {
            res.json({ success: true, data: user });
        });
    });
    
    router.post('/tasks', (req, res) => {
        User.findById(req.dec._id).catch((err) => {
            res.json({ success: false, err });
        }).then((user) => {
            let task = {
                text: req.body.text
            };
            if ('type' in req.body) task.type = req.body.type;
            user.tasks.push(task);
            user.save().catch((err) => {
                res.json({ success: false, err });
            }).then((newUser) => {
                res.json({ success: true, data: newUser });
            });
        });
    });
    
    router.route('/tasks/:taskID').put((req, res) => {
        res.json({ success: false, err: "PUT /tasks/:taskID has not been completed."});
    }).delete((req, res) => {
        res.json({ success: false, err: "DELETE /tasks/:taskID has not been completed."});
    });
    
    return router;
}

function getUnprotected() {
    let router = Router();
    
    router.route('/').post((req, res) => {
        // bcrypt.hash(req.body.pass, 11, (err, hash) => {
        console.log(req.body);
        bcrypt.hash(req.body.pass, 1, (err, hash) => {
            console.log(hash);
            let user = new User({
                email: req.body.email,
                pass: hash
            });
            console.log(user);
            user.save().catch((err) => {
                console.error(err);
                res.json({ success: false, err });
            }).then((newUser) => {
                console.log(newUser);
                res.json({ success: true, data: newUser });
            });
        });
    });
    
    return router;
}

export function getUserRoutes() {
    return {
        // unprotected: getUnprotected(),
        protected: getProtected(),
        unprotected: getUnprotected()
    }
}