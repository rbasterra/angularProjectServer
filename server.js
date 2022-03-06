const express = require('express');
const db = require('./db');
const server = express();
const config = require('./config');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('./authentication/passport');

const userRouter = require('./router/user.router');


server.use(express.json());
server.use(express.urlencoded({extended:false}));
server.disabled('x-powered-by');

server.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000
    },
    store: MongoStore.create({mongoUrl: config.DB_URL})
}));

server.use(passport.initialize());
server.use(passport.session());

server.use('/user', userRouter);
server.use('*', (req, res, next) => {
    const error = new Error('Resource not found');
    error.status = 404;
    return next(error);
});



server.use((err, _req, res, _next) =>{
    return res
        .status(err.status || 500)
        .json(err.message || 'Unexpected server error');
});

db.connectDB().then(() => {
    console.log('Connected to MongoDB');
    server.listen(config.PORT, () => console.log(`Server listening on port: ${config.PORT}`));
});