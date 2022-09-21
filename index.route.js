const express = require('express');
const { userRoutes } = require('./user');
const { subscriptionRoutes } = require('./subscription')

const apiRoutes = express.Router({mergeParams: true});

apiRoutes.use('/user', userRoutes);
apiRoutes.use('/subscription',subscriptionRoutes);

module.exports = apiRoutes;