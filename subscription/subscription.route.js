const express = require('express');
const router = express.Router();
const subscriptionController = require('./subscription.controller');
const auth = require('../middleware/auth');

router.get('/getSubscrition', auth, subscriptionController.allSubscriptions);

module.exports = router;
