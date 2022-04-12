const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth.middleware');
const config = require('../config');

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


userRouter.get('/:id', [auth.isAuthenticated], (req, res, next) => {
    const id = req.params.id;
    return User.findById(id)
        .then( user => res.status(200).json(user))
        .catch(error => next(error));
})

userRouter.put('/update', [auth.isAuthenticated], async (req, res, next) => {
    

    if (!req.body) {
        const error = new Error('missing request body data');
        error.status = 400;
        return next(error);
    }

    // if (req.body.password === '') {
    //     console.log('empty pwd');
    //     const userMod = new User({
    //         name: req.body.name,
    //         lastname: req.body.lastname,
    //         email: req.body.email,
    //         phoneNumber: req.body.phone,
    //         birthDate: new Date(req.body.birthdate),
    //         address: req.body.address,
    //         city: req.body.city,
    //         postal_code: req.body.postal_code,
    //         province: req.body.province});
    // } else {
    //     const encryptedPwd = await bcrypt.hash(req.body.password, Number(config.SALT_ROUNDS));

    //     const userMod = new User({
    //         name: req.body.name,
    //         lastname: req.body.lastname,
    //         email: req.body.email,
    //         password: encryptedPwd,
    //         phoneNumber: req.body.phone,
    //         birthDate: new Date(req.body.birthdate),
    //         address: req.body.address,
    //         city: req.body.city,
    //         postal_code: req.body.postal_code,
    //         province: req.body.province});
    // }
    
    let userMod = new User({
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        phoneNumber: req.body.phone,
        birthDate: new Date(req.body.birthdate),
        address: req.body.address,
        city: req.body.city,
        postal_code: req.body.postal_code,
        province: req.body.province});

    if (!(req.body.password === '')){
        console.log('not empty');
        const encryptedPwd = await bcrypt.hash(req.body.password, Number(config.SALT_ROUNDS));
        console.log('encruptedPwd: ' + encryptedPwd);
        // userMod = ({...userMod, password: encryptedPwd})
        userMod.password = encryptedPwd;
        console.log(userMod);
    }

    // console.log(userMod);

    // User.findById(req.body.id).then(user => {
    //     console.log(user);
    // })

    return User.findByIdAndUpdate(req.body.id, userMod, {new:true})
        .then(userUpdated => res.status(200).json(userUpdated))
        .catch(error => next(error));

})

userRouter.post('/logout', [auth.isAuthenticated], (req, res, next) => {
   
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