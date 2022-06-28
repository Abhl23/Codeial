const Post=require('../models/post');
const Comment=require('../models/comment');
const Like=require('../models/like');

module.exports.create=async function(req, res){

    try{
        let post=await Post.create({
            content : req.body.content,
            user : req.user._id
        });

        post=await Post.findById(post._id).populate({
            path : 'user',
            select : 'name'
        });
        console.log(post);

        if(req.xhr){
            return res.status(200).json({
                data : {
                    post : post
                },
                message : 'Post published!'
            });
        }
    
        // req.flash('success', 'Post Created!');
        // return res.redirect('back');
    }catch(err){
        console.log(err);
        req.flash('error', err);
        return res.redirect('back');
    }
};

module.exports.destroy=async function(req, res){

    try{
        let post=await Post.findById(req.params.id);
        // console.log(post.user==req.user.id);
        if(post.user == req.user.id){

            await Like.deleteMany({
                likeable : req.params.id,
                onModel : 'Post'
            });
            await Like.deleteMany({
                likeabke : {$in : post.comments},       // $in is a query operator of mongoDB
                onModel : 'Comment'
            });

            post.remove();

            await Comment.deleteMany({post : req.params.id});

            if(req.xhr){
                return res.status(200).json({
                    data : {
                        post_id : req.params.id
                    },
                    message : 'Post and the comments associated deleted!'
                });
            }

            req.flash('success', 'Post and associated comments deleted!');
            return res.redirect('back');
        }
        else{
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
};