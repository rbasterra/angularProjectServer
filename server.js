const express = require('express');
const db = require('./db');
const server = express();
const config = require('./config');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
require('./authentication/passport');

const auth = require('./middlewares/auth.middleware');

const userRouter = require('./router/user.router');
const testRouter = require('./router/test.router');


server.use(express.json());
server.use(express.urlencoded({extended:false}));
server.disable('x-powered-by');

server.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000,
        secure: false
    },
    store: MongoStore.create({mongoUrl: config.DB_URL})
}));

server.use(passport.initialize());
server.use(passport.session());

const corsWhiteList = ['http://localhost:4200', 'https://marvel-service-project.vercel.app/'];

const corsOptions = {
    origin: (origin, callback) => {
        console.log(origin);
        if (corsWhiteList.indexOf(origin) !== -1) {
            console.log('cors callback true');
            callback(null,true)}
        else callback(new Error('Not allowed by CORS'))
    },
    credentials: true
}

server.options('*', cors(corsOptions));

server.use('/user', [cors(corsOptions)], userRouter);
server.use('/test', [cors(), auth.isAuthenticated], testRouter);

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