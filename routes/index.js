const express=require('express');
const router=express.Router();

console.log('Router is loaded.');

const homeController=require('../controllers/home_controller.js');

router.get('/', homeController.home);
router.use('/users', require('./users'));

module.exports=router;