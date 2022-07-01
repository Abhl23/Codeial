const express=require('express');
const router=express.Router();

const friendshipsController=require('../controllers/friendships_controller');

router.get('/create', friendshipsController.createFriendship);

router.get('/destroy', friendshipsController.destroyFriendship);


module.exports=router;