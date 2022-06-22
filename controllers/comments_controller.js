const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.create=async function(req, res){
    
    try{
        let post=await Post.findById(req.body.post);

        if(post){
            let comment=await Comment.create({
                content : req.body.content,
                user : req.user._id,
                post : req.body.post
            });

            // updating the post collections' document
            // will automatically insert the comment id in the comments array of post
            post.comments.unshift(comment);       // inserts comment id in the order from latest to oldest
            post.save();

            comment=await Comment.findById(comment._id)
            .populate('post')
            .populate('user', 'name');

            if(req.xhr){
                return res.status(200).json({
                    data : {
                        comment : comment
                    },
                    message : 'Comment created!'
                });
            }

            req.flash('success', 'Comment Created!');
            return res.redirect('back');
        }
        else{
            req.flash('error', 'Post no longer available!');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
};

module.exports.destroy=async function(req, res){
    try{
        let comment=await Comment.findById(req.params.id);
        let postId=comment.post;
        let post=await Post.findById(postId);
        if(comment.user == req.user.id || post.user == req.user.id){

            comment.remove();
            // deleting the comment id from the comments array in post
            await Post.findByIdAndUpdate(postId, { $pull : {comments : req.params.id}});

            if(req.xhr){
                return res.status(200).json({
                    data : {
                        comment_id : req.params.id
                    },
                    message : 'Comment deleted!'
                });
            }
            
            req.flash('success', 'Comment Deleted!');
            return res.redirect('back');
        }
        else{
            req.flash('error', 'You cannot delete this comment!');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
};