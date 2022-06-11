const Post=require('../models/post');
const User=require('../models/user');

module.exports.home=function(req, res){
    // populate the user and comments of each post
    Post.find({})
    .populate('user')
    .populate({
        path : 'comments',
        populate : {            // further populating the user of every comment i.e Nested populating
            path : 'user'
        }
    })
    .exec(function(err, posts){

        if(err){
            console.log('Error in fetching posts from the database');
            return;
        }

        User.find({}, function(err, users){
            return res.render('home', {
                title : 'Home',
                posts : posts,
                users : users
            });
        });
    });        
};