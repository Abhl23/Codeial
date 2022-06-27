const User=require('../models/user');
const ResetToken=require('../models/reset_password_token');
const fs=require('fs');
const path=require('path');

const crypto=require('crypto');

const resetPasswordMailer=require('../mailers/reset_password_mailer');


// lets keep this the same
module.exports.profile=function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title : "User Profile",
            user_profile : user
        });
    });
};

module.exports.update=async function(req, res){

    if(req.user.id == req.params.id){

        try{
            let user=await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log('Multer Error:', err);
                    return;
                }

                console.log(req.file);

                user.name=req.body.name;
                user.email=req.body.email;

                if(req.file){

                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                    // this is saving the path of the uploaded file in the avatar field of the user
                    user.avatar=User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');

            });
        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }

    }
    else{
        req.flash('error', 'Unauthorized');
        return res.status(401).send('Unauthorized');
    }


    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         req.flash('success', 'Profile updated!');
    //         return res.redirect('back');
    //     });
    // }
    // else{
    //     return res.status(401).send('Unauthorized');
    // }
};

// render the forgot password page
module.exports.forgotPassword=function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }

    return res.render('forgot_password', {
        title : 'Codeial | Forgot Password'
    });
};

// create the reset password token
module.exports.resetLink=async function(req, res){
    try{
        let user=await User.findOne({email : req.body.email});

        let resetToken=await ResetToken.create({
            user : user._id,
            accessToken : crypto.randomBytes(20).toString('hex'),
            isValid : true
        });

        resetToken=await ResetToken.findById(resetToken._id).populate('user', 'name email');

        resetPasswordMailer.resetPassword(resetToken);

        req.flash('success', 'Reset link sent!');
        return res.redirect('/');
    }catch(err){
        console.log('Error in reset link action', err);
        return res.redirect('back');
    }
};

// render the reset password page
module.exports.resetPassword=async function(req, res){

    let resetToken=await ResetToken.findOne({accessToken : req.query.accessToken});

    console.log(resetToken.isValid);

    if(resetToken.isValid){
        return res.render('reset_password', {
            title : 'Codeial | Reset Password',
            resetToken : resetToken
        });
    }
    else{
        return res.send('<h1>Reset password token invalid!</h1>');
    }
    
};

// update password
module.exports.updatePassword=async function(req, res){
    if(req.body.password!=req.body.confirm_password){
        req.flash('error', 'Invalid confirm password!');
        return res.redirect('back');
    }

    try{
        await User.findByIdAndUpdate(req.body.user_id, {password : req.body.password});

        let resetToken=await ResetToken.findOne({user : req.body.user_id});
        resetToken.isValid=false;
        resetToken.save();

        req.flash('success', 'Password changed successfully!');
        return res.redirect('/users/sign-in');
    }catch(err){
        req.flash('error', 'Password change unsuccessful!');
        console.log('Error in changing password:', err);
        return res.redirect('back');
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