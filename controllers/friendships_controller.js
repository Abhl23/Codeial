const Friendship=require('../models/friendship');
const User=require('../models/user');

module.exports.createFriendship=async function(req, res){

    console.log('Inside create friendship');

    let friendship=await Friendship.create({
        from_user : req.user._id,
        to_user : req.query.id
    });

    let from_user=await User.findById(req.user._id);
    let to_user=await User.findById(req.query.id);


    from_user.friendships.push(friendship._id);
    from_user.save();

    to_user.friendships.push(friendship._id);
    to_user.save();

    return res.status(200).json({
        message : 'You both are friends now!'
    });
};

module.exports.destroyFriendship=async function(req, res){

    try{
        console.log('Inside destroy friendship');


        var friendship=await Friendship.findOne({
            from_user : req.user._id,
            to_user : req.query.id
        });

        if(!friendship){

            friendship=await Friendship.findOne({
                from_user : req.query.id,
                to_user : req.user._id
            });

            // console.log('******2nd check', friendship);
        }

        // console.log('************',friendship);

        let user1=await User.findById(req.user._id);
        let user2=await User.findById(req.query.id);

        user1.friendships.pull(friendship._id);
        user1.save();

        user2.friendships.pull(friendship._id);
        user2.save();

        friendship.remove();

        return res.status(200).json({
            message : 'Friend Removed!'
        });
    }catch(err){
        console.log('Error in destroy friendship action:', err);
        return res.status(500).json({
            message : 'Internal Server Error'
        });
    }
};