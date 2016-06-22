import mongoose from 'mongoose';
import config from 'config';

export function initializeDatabase() {
  let host = config.get('db.hostname');
  let port = config.get('db.port');
  let name = config.get('db.name');
  mongoose.connect(`mongodb://${host}:${port}/${name}`);
}

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
    completed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        index: {
            unique: true
        }
    },
    pass: {
        type: String,
        required: [true, 'Password required.']
    },
    tasks: [taskSchema]
}, {
});

export const User = mongoose.model('User', userSchema);