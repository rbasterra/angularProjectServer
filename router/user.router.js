const express = require('express');
const passport = require('passport');

const userRouter = express.Router();

userRouter.post('/register', (req, res, next) => {
    const callback = (error, user) => {
        if (error){
            return next(error);
        }

        req.logIn(user, (errorLogin) =>{
            if (errorLogin){
                return next (errorLogin);
            }
            return res.status(200).json(user);
        });
    }

    passport.authenticate('register', callback)(req);
});

userRouter.post('/login', (req, res, next) => {

    console.log(req.body);
    
    const callback = (error, user) => {
        if (error){
            return next (error);
        }

        req.logIn(user, (errorLogin) => {
            if (errorLogin){
                return next(errorLogin);
            }
            return res.status(200).json(user);
        });
    }

    passport.authenticate('login', callback)(req);

});

userRouter.post('/logout', (req, res, next) => {
    if(!req.user){
        return res.sendStatus(304);
    }

    req.logout();

    return req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.status(200).json('user session closed');
    });
});

module.exports = userRouter;