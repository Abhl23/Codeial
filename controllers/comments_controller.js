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
            post.comments.push(comment);
            post.save();

            return res.redirect('back');
        }
        else{
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error:', err);
        return;
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
            return res.redirect('back');
        }
        else{
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error:', err);
        return;
    }
};