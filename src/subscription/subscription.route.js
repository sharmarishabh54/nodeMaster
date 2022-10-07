const express = require('express');
const router = express.Router();
const subscriptionController = require('./subscription.controller');
const auth = require('../middleware/auth');


router.get('/subscriptions',(req,res,next)=>{
    auth(req,res,next,'Admin')
}, subscriptionController.allSubscriptions);

router.post('/subscriptions',(req, res, next)=>{
    auth(req,res,next,'Admin');
},subscriptionController.createSubscriptions);


router.patch('/subscriptions/:id',  (req, res, next) =>{
    auth(req, res, next, 'Admin');
}, subscriptionController.updateSubscriptions);

router.delete('/subscriptions/:id', (req, res, next) =>{
    auth(req, res, next, 'Admin');
}, subscriptionController.deleteSubscriptions);


module.exports = router;
