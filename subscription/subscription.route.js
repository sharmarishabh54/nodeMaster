const express = require('express');
const router = express.Router();
const subscriptionController = require('./subscription.controller');
const auth = require('../middleware/auth');

router.get('/subscritions', auth, subscriptionController.allSubscriptions);
router.patch('/subscritions/:id', auth, subscriptionController.updateSubscriptions);
router.delete('/subscritions/:id', auth, subscriptionController.deleteSubscriptions);

module.exports = router;
