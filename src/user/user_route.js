const express = require('express');
const router = express.Router();

const userController = require('./user_controller');
const auth= require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.patch('/update',(req,res,next)=>{
    auth(req,res,next,"Moderator")
},userController.update);

router.get('/seeSubscription',(req,res,next)=>{
    auth(req,res,next,"Admin");
},userController.seeSubscription);

module.exports = router