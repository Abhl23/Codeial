const nodeMailer=require('../config/nodemailer');

// this is another way of exporting a method
exports.newComment= (comment) => {
    console.log('Inside newComment mailer', comment.user.email);

    nodeMailer.transporter.sendMail({
        from : 'anothaonexo@gmail.com',
        to : comment.user.email,
        subject : 'New Comment Published!',
        html : '<h1>Yupp, your comment is now published!</h1>'
    }, (err, info) => {
        if(err){
            console.log('Error in sending email:', err);
            return;
        }

        console.log('Message sent!', info);
    });
}