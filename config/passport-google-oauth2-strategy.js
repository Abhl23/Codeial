const passport=require('passport');

const googleStrategy=require('passport-google-oauth').OAuth2Strategy;

const crypto=require('crypto');

const User=require('../models/user');

// tell passport to use new strategy for google log in
passport.use(new googleStrategy({
    clientID : '117983069566-j3uigaqafsqlqvl3uqkqtbvouqg9h16s.apps.googleusercontent.com',
    clientSecret : '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',
    callbackURL : 'http://localhost:8000/users/auth/google/callback'
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