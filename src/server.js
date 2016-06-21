import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import config from 'config';
import { initializeDatabase } from './db';
import { getRoutes } from './routes';
import mongoose from 'mongoose';
mongoose.Promise = Promise;

let app = express();
let server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

initializeDatabase();

app.use('/api', getRoutes());

server.listen(config.get('http.port'), config.get('http.hostname'), () => {
    let addr = server.address();
    console.log(`ToDo server listening at ${addr.address}:${addr.port}`);
});