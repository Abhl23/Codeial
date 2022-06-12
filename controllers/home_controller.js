const Post=require('../models/post');
const User=require('../models/user');

module.exports.home=async function(req, res){

    try{
        let posts=await Post.find({})
        .populate('user')
        .populate({
            path : 'comments',
            populate : {
                path : 'user'
            }
        });

        let users=await User.find({});

        return res.render('home', {
            title : 'Home',
            posts : posts,
            all_users : users
        });
    }catch(err){
        console.log('Error:', err);
        return;
    }
};


    // // populate the user and comments of each post
    // Post.find({})
    // .populate('user')
    // .populate({
    //     path : 'comments',
    //     populate : {            // further populating the user of every comment i.e Nested populating
    //         path : 'user'
    //     }
    // })
    // .exec(function(err, posts){

    //     if(err){
    //         console.log('Error in fetching posts from the database');
    //         return;
    //     }

    //     User.find({}, function(err, users){
    //         return res.render('home', {
    //             title : 'Home',
    //             posts : posts,
    //             all_users : users
    //         });
    //     });
    // });        