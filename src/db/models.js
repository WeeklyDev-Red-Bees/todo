import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

var taskSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'A task requires text.']
    },
    type: {
        type: String,
        enum: ['High', 'Moderate', 'Low'],
        default: 'Moderate'
    },
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
    },
    pass: {
        type: String,
        required: [true, 'Password required.']
    },
    // tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
    tasks: [taskSchema]
}, {
    toObject: (doc, ret, options) => {
        delete ret.password;
    }
});

// userSchema.pre('save', function(next) {
//     console.log(this);
//     if (this.isNew) {
//         console.log('is new');
//         bcrypt.hash(this.pass, 16, (err, hash) => {
//             if (err) {
//                 next(err);
//             } else {
//                 this.pass = hash;
//                 console.log(this);
//                 next();
//             }
//         });
//     } else {
//         next();
//     }
// });


export const User = mongoose.model('User', userSchema);