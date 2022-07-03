const passport=require('passport');

const googleStrategy=require('passport-google-oauth').OAuth2Strategy;

const crypto=require('crypto');

const User=require('../models/user');

const env=require('./environment');

// tell passport to use new strategy for google log in
passport.use(new googleStrategy({
    clientID : env.google_client_id,
    clientSecret : env.google_client_secret,
    callbackURL : env.google_callback_url
},
function(accessToken, refreshToken, profile, done){

    // find the user
    User.findOne({email : profile.emails[0].value}).exec(function(err, user){
        if(err){
            console.log('Error in google strategy-passport:', err);
            return;
        }

        // if found, set this user as req.user
        if(user){
            return done(null, user);
        }
        else{
            // if not found, create the user and then set it as req.user
            User.create({
                email : profile.emails[0].value,
                name : profile.displayName,
                password : crypto.randomBytes(20).toString('hex')
            }, function(err, user){
                if(err){
                    console.log('Error in creating a user in google strategy-passport:', err);
                    return;
                }

                return done(null, user);
            });
        }
    });
}));


module.exports=passport;