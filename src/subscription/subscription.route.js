const express = require('express');
const router = express.Router();
const subscriptionController = require('./subscription.controller');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.get('/subscritions',auth,(req, res, next) => {
    checkRole(req, res, next, 'Admin');
}, subscriptionController.allSubscriptions);
router.patch('/subscritions/:id', auth, subscriptionController.updateSubscriptions);
router.delete('/subscritions/:id', auth, subscriptionController.deleteSubscriptions);

module.exports = router;
