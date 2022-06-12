const User=require('../models/user');


// lets keep this the same
module.exports.profile=function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title : "User Profile",
            user_profile : user
        });
    });
};

module.exports.update=function(req, res){
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            req.flash('success', 'Profile updated!');
            return res.redirect('back');
        });
    }
    else{
        return res.status(401).send('Unauthorized');
    }
};

// render the sign-in page
module.exports.signIn=function(req, res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title : "Codeial | Sign In"
    });
};

// render the sign-up page
module.exports.signUp=function(req, res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

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
            req.flash('error', err);
            return res.redirect('back');
        }

        if(!user){
            User.create(req.body, function(err, user){
                if(err){
                    req.flash('error', err);
                    return res.redirect('back');
                }

                req.flash('success', 'Account created!');
                return res.redirect('/users/sign-in');
            });
        }
        else{
            req.flash('error', 'Account already exists!');
            return res.redirect('back');
        }
    })
};

// sign in and create a session for the user
module.exports.createSession=function(req, res){
    req.flash('success', 'Logged in Successfully!');
    return res.redirect('/');
};

// sign out and delete the user's session
module.exports.destroySession=function(req, res){
    req.logout(function(err){
        if(err){
            req.flash('error', err);
            return res.redirect('back');
        }

        req.flash('success', 'You have Logged out!');   

        return res.redirect('/');
    });
}