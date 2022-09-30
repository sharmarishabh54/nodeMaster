const express = require('express');
const router = express.Router();
const subscriptionController = require('./subscription.controller');
const auth = require('../middleware/auth');


router.get('/subscriptions',(req,res,next)=>{
    auth(req,res,next,'Admin')
}, subscriptionController.allSubscriptions);

router.post('/subscriptions',(req, res, next) =>{
    auth(req, res, next, 'Moderator');
},subscriptionController.createSubscriptions);


router.patch('/subscriptions/:id',  (req, res, next) =>{
    auth(req, res, next, 'Moderator');
}, subscriptionController.updateSubscriptions);

router.delete('/subscriptions/:id', (req, res, next) =>{
    auth(req, res, next, 'Moderator');
}, subscriptionController.deleteSubscriptions);


router.get('/subscriptions/moderator',(req, res, next) => {
    auth(req, res, next, 'Moderator');
}, subscriptionController.getUserAndSubscriptions);

module.exports = router;
