const express = require('express');
const router = express.Router();

const userController = require('./user_controller');
const auth = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.patch('/buy-subscription', (req, res, next) => {
    auth(req, res, next, "Moderator")
}, userController.buySubscription);

router.patch('/update', (req, res, next) => {
    auth(req, res, next, "All")
}, userController.update);

router.get('/seeAllSubscription', (req, res, next) => {
    auth(req, res, next, "Admin");
}, userController.seeSubscription);

router.get('/userSubscripytion', (req, res, next) => {
    auth(req, res, next, "Moderator")
}, userController.moderatorUser);

router.get('/home', (req, res, next) => {
    auth(req, res, next, "Moderator")
}, userController.isSubscribed, (req, res, next) => {
    res.send("welcome to prime user")
});

router.delete('/delete', (req, res, next) => {
    auth(req, res, next, "All")
}, userController.deleteUser)

module.exports = router