const Like=require('../models/like');
const Post=require('../models/post');
const Comment=require('../models/comment');

module.exports.toggleLike=async function(req, res){
    try{
        // find the likeable
        let likeable;
        let deleted=false;    // tells you in the frontend if the like has been created or destroyed

        if(req.query.type=='Post'){
            likeable=await Post.findById(req.query.id).populate('likes');
        }
        else{
            likeable=await Comment.findById(req.query.id).populate('likes');
        }

        // check if the like already exists
        let existingLike=await Like.findOne({
            likeable : req.query.id,
            onModel : req.query.type,
            user : req.user._id
        });

        // if the like already exists then delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.remove();
            deleted=true;
        }
        else{
            // else make a new like
            let newLike=await Like.create({
                user : req.user._id,
                likeable : req.query.id,
                onModel : req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.status(200).json({
            message : 'Request Successful!',
            data : {
                deleted : deleted
            }
        });
    }catch(err){
        console.log('Error in toggleLike action:', err);
        return res.status(500).json({
            message : 'Internal Server Error'
        });
    }
};