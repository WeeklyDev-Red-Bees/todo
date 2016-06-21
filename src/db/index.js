export * from './models';

import mongoose from 'mongoose';
import config from 'config';

export function initializeDatabase() {
    let host = config.get('db.hostname');
    let port = config.get('db.port');
    let name = config.get('db.name');
    mongoose.connect(`mongodb://${host}:${port}/${name}`);
}