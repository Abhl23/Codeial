const nodemailer=require('../config/nodemailer');

exports.resetPassword= (resetToken) => {
    console.log('Inside reset password mailer', resetToken.user.email);

    let htmlString=nodemailer.renderTemplate({resetToken : resetToken}, '/passwords/reset_password.ejs');

    nodemailer.transporter.sendMail({
        from : 'anothaonexo@gmail.com',
        to : resetToken.user.email,
        subject : 'Reset Password!',
        html : htmlString
    }, function(err, info){
        if(err){
            console.log('Error in sending email:', err);
            return;
        }

        console.log('Message sent!', info);
    })
}