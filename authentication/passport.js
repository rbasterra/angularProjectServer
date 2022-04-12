const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const {v4:uuid} = require('uuid');
const User = require('../models/User');
const config = require('../config');


passport.serializeUser((user,done) => {
    return done(null,user._id)
});


passport.deserializeUser(async(userId,done)=>{
    
    try{
        const existingUser = await User.findById(userId);
        return done(null,existingUser);
    } catch(err){
        return done(err);
    }
});

function generateUuid (){
    newUuid = uuid();
    
    User.find({_id: newUuid})
        .then(id =>{
            if (id.length > 0){
                return generateUuid();
            }
        })
        .catch(err =>{
            const error = new Error(err);
            error.status = err.status;
            return next(error);
        });

    
    return newUuid;
}

passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, username, password, done) => {
    try{
        const existingUser = await User.findOne({email: username});

        if (existingUser){
            const error = new Error (`Authentication failed: User email ${existingUser.email} already exists`);
            error.status = 409;
            return done(error);
        }

        const encryptedPwd = await bcrypt.hash(password, Number(config.SALT_ROUNDS));

        const newUser = new User({
            _id: generateUuid(),
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            password: encryptedPwd,
            phoneNumber: req.body.phone,
            birthDate: req.body.birthdate,
            address: req.body.address,
            city: req.body.city,
            postal_code: req.body.postal_code,
            province: req.body.province
        });

        const savedUser = await newUser.save();
        savedUser.password = null;
        return done(null, savedUser);        

    }
    catch(error) {
        return done(error);
    }
}))

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, username, password, done) => {
    try{
        const user = await User.findOne({email: username});

        if (!user){
            const error = new Error('Authentication failed: User email not found');
            error.status = 404;
            return done(error);
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword){
            const error = new Error('Authentication failed: Wrong password');
            error.status = 401;
            return done(error);
        }

        user.password = null;
        return done(null, user);

    }
    catch(error){
        return done(error);
    }
}))