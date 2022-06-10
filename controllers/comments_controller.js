const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.create=function(req, res){
    Post.findById(req.body.post, function(err, post){
        if(err){
            console.log('Error in finding the post in the db');
            return;
        }

        if(post){
            Comment.create({
                content : req.body.content,
                user : req.user._id,
                post : req.body.post
            }, function(err, comment){
                if(err){
                    console.log('Error in creating a comment in the db');
                    return;
                }
                // updating the post collections' document
                // will automatically insert the comment id in the comments array of post
                post.comments.push(comment);
                post.save();

                return res.redirect('/');
            });
        }
    });
};

module.exports.destroy=function(req, res){
    Comment.findById(req.params.id, function(err, comment){
        let postId=comment.post;
        Post.findById(postId, function(err, post){
            if(comment.user == req.user.id || post.user == req.user.id){

                comment.remove();
    
                Post.findByIdAndUpdate(postId, { $pull : {comment : req.params.id}}, function(err, post){
                    return res.redirect('back');
                });
            }
            else{
                return res.redirect('back');
            }
        });
    });
};