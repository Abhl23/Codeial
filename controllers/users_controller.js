const User=require('../models/user');

module.exports.profile=function(req, res){
    if(!req.cookies.user_id){
        return res.redirect('/users/sign-in');
    }
    User.findOne({id: req.cookies.user_id}, function(err, user){
        if(err){
            console.log('Error in finding the user while displaying profile');
        }

        if(user){
            console.log(user);
            return res.render('user_profile', {
                title : "User Profile",
                user : user
            });
        }
        else
            return res.redirect('/users/sign-in');
    });
};

// render the sign-in page
module.exports.signIn=function(req, res){
    return res.render('user_sign_in', {
        title : "Codeial | Sign In"
    });
};

// render the sign-up page
module.exports.signUp=function(req, res){
    return res.render('user_sign_up', {
        title : "Codeial | Sign Up"
    });
}

// get the sign up data
module.exports.create=function(req, res){
    if(req.body.password!=req.body.confirm_password)
        return res.redirect('back');
    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            console.log('Error in finding user while signing up');
            return;
        }

        if(!user){
            User.create(req.body, function(err, user){
                if(err){
                    console.log('Error in creating user while signing up');
                    return;
                }

                return res.redirect('/users/sign-in');
            });
        }
        else
            return res.redirect('back');
    })
};

// sign in and create a session for the user
module.exports.createSession=function(req, res){
    // steps to authenticate
    // find the user
    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            console.log('Error in finding the user while signing in');
            return;
        }

        // handle the user found
        if(user){
            // handle if the password does not match
            if(user.password!=req.body.password){
                return res.redirect('back');
            }

            // create session
            res.cookie('user_id', user.id);
            return res.redirect('/users/profile');
        }
        // handle if the user not found
        else{
            return res.redirect('back');
        }
    });
};

// sign-out and delete a session
module.exports.deleteSession=function(req, res){
    res.cookie('user_id', '');
    return res.redirect('back');
};