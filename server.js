const express = require('express');
const db = require('./db');
const server = express();

const config = require('./config');

server.use(express.json());
server.use(express.urlencoded({extended:false}));
server.disabled('x-powered-by');


server.use((err, _req, res, _next) =>{
    return res
        .status(err.status || 500)
        .json(err.message || 'Unexpected server error');
});

db.connectDB().then(() => {
    console.log('Connected to MongoDB');
    server.listen(config.PORT, () => console.log(`Server listening on port: ${config.PORT}`));
});