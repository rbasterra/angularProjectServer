const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const {v4:uuid} = require('uuid');
const User = require('../models/User');
const config = require('../config');


passport.serializeUser((user,done) => {return done(null,user._id)});


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

passport.use('register', new LocalStrategy)({
    usernameField: 'userEmail',
    passwordField: 'userPwd',
    passReqToCallback: true,
}, async (req, username, password, done) => {
    try{
        const existingUser = await User.findOne({email: username});

        if (existingUser){
            error = new Error (`User email ${existingUser.email} already exists`);
            error.status = 409;
            return done(error);
        }

        const encryptedPwd = await bcrypt.hash(password, Number(config.SALT_ROUNDS));

        const newUser = new User({
            _id: generateUuid(),
            name: req.body.user_name,
            lastname: req.body.user_lastname,
            email: req.body.user_email,
            password: encryptedPwd,
            phoneNumber: req.body.user_phoneNumber,
            birthDate: req.body.user_birthdate,
            address: req.body.user_address,
            city: req.body.user_city,
            postal_code: req.body.user_postalCode,
        });

        const savedUser = await newUser.save();

        return done(null, savedUser);        

    }
    catch(error) {
        return done(error);
    }
})

passport.use('login', new LocalStrategy({
    usernameField: 'userEmail',
    passwordField: 'userPwd',
    passReqToCallback: true,
}, async (req, username, password, done) => {
    try{
        const user = await User.findOne({email: username});

        if (!user){
            const error = new Error('User email not found');
            error.status = 404;
            return done(error);
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword){
            const error = new Error('Wrong password');
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