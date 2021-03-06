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
        // console.log(req.dec);
        User.findById(req.dec._id).catch((err) => {
            res.json({ success: false, err });
        }).then((user) => {
            res.json({ success: true, data: user });
        });
    });
    
    router.post('/tasks', (req, res) => {
        if (!('text' in req.body)) {
            return res.json({ success: false, err: "Insufficient parameters." });
        }
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
        let updateObj = {};
        if ('text' in req.body) updateObj['tasks.$.text'] = req.body.text;
        if ('type' in req.body) updateObj['tasks.$.type'] = req.body.type;
        console.log(updateObj);
        User.findOneAndUpdate({
            "_id": req.dec._id,
            "tasks._id": req.params.taskID
        }, { "$set": updateObj }).catch((err) => {
            res.json({ success: false, err });
        }).then((user) => {
            // res.json({ success: true, data: user });
            User.findById(user._id).catch((err) => {
                res.json({ success: false, err });
            }).then((newUser) => {
                res.json({ success: true, data: newUser });
            });
        });
        // res.json({ success: false, err: "PUT /tasks/:taskID has not been completed."});
    }).delete((req, res) => {
        User.findById(req.dec._id).catch((err) => {
            res.json({ success: false, err });
        }).then((user) => {
            user.tasks.id(req.params.taskID).remove();
            user.save().catch((err) => {
                res.json({ success: false, err });
            }).then((newUser) => {
                res.json({ success: true, data: user });
            });
        });
        
        // res.json({ success: false, err: "DELETE /tasks/:taskID has not been completed."});
    });
    
    router.get('/tasks/:taskID/complete', (req, res) => {
        console.log('uuugh');
        User.findById(req.dec._id).catch((err) => {
            res.json({ success: false, err });
        }).then((user) => {
            let task = user.tasks.id(req.params.taskID);
            User.findOneAndUpdate({
                "_id": user._id,
                "tasks._id": req.params.taskID
            }, { "$set": { "tasks.$.completed": !task.completed }}).catch((err) => {
                res.json({ success: false, err });
            }).then(() => {
                User.findById(user._id).catch((err) => {
                    res.json({ success: true, err });
                }).then((newUser) => {
                    res.json({ success: true, data: newUser });
                });
            });
        });
    });
    
    return router;
}

function getUnprotected() {
    let router = Router();
    
    router.route('/').post((req, res) => {
        // bcrypt.hash(req.body.pass, 11, (err, hash) => {
        // console.log(req.body);
        bcrypt.hash(req.body.pass, 1, (err, hash) => {
            // console.log(hash);
            let user = new User({
                email: req.body.email,
                pass: hash
            });
            // console.log(user);
            user.save().catch((err) => {
                // console.error(err);
                res.json({ success: false, err });
            }).then((newUser) => {
                // console.log(newUser);
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