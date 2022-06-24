const Post=require('../../../models/post');
const Comment=require('../../../models/comment');

module.exports.index=async function(req, res){            // index is usually used when you want to list down something

    let posts=await Post.find({})
        .sort('-createdAt')
        .populate('user', 'name')                   // populate the user and comments of each post
        .populate({
            path : 'comments',
            populate : {                    // further populating the user of every comment i.e Nested populating
                path : 'user',
                select : 'name'
            }
        });


    return res.status(200).json({
        message : 'List of posts',
        posts : posts
    });
};


module.exports.destroy=async function(req, res){

    try{
        let post=await Post.findById(req.params.id);

            if(post.user==req.user.id){

                post.remove();

                await Comment.deleteMany({post : req.params.id});


                return res.status(200).json({
                    message : 'Post and associated comments deleted!'
                });
            }
            else{
                return res.status(401).json({
                    message : 'You cannot delete this post!'
                });
            }
    }catch(err){
        return res.status(500).json({
            message : 'Internal Server Error'
        });
    }
};