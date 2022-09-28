const express = require('express');
const router = express.Router();
const subscriptionController = require('./subscription.controller');
const auth = require('../middleware/auth');


router.get('/subscritions',(req,res,next)=>{
    auth(req,res,next,'Admin')
}, subscriptionController.allSubscriptions);

router.post('/subscriptions',(req, res, next) =>{
    auth(req, res, next, 'Moderator');
},subscriptionController.createSubscriptions);


router.patch('/subscritions/:id', auth, subscriptionController.updateSubscriptions);
router.delete('/subscritions/:id', auth, subscriptionController.deleteSubscriptions);


router.get('/subscritions/moderator',(req, res, next) => {
    auth(req, res, next, 'Moderator');
}, subscriptionController.getUserAndSubscriptions);

module.exports = router;
