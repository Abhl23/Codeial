const Post=require('../models/post');

module.exports.home=function(req, res){
    Post.find({}).populate('user').exec(function(err, posts){
        if(err){
            console.log('Error in fetching posts from the database');
            return;
        }

        return res.render('home', {
            title : 'Home',
            posts : posts
        });
    });        
};