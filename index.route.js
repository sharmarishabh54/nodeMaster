const express = require('express');
const { userRoutes } = require('./src/user');
const { subscriptionRoutes } = require('./src/subscription')

const apiRoutes = express.Router({mergeParams: true});

apiRoutes.use('/user', userRoutes);
apiRoutes.use('/subscription',subscriptionRoutes);

module.exports = apiRoutes;