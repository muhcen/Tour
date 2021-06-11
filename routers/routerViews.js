const express = require('express');

const controller = require('./../controller/viewController');
const authController = require('./../controller/authController');
const bookingController = require('./../controller/bookingController');

const router = express.Router();

router.get('/', bookingController.createBooking, authController.loginUser, controller.overview);
router.get('/tour/:slug', authController.loginUser, controller.getTour);
router.get('/login', authController.loginUser, controller.login);
router.get('/Me', authController.loginUser, controller.account);
router.get('/my-tours', authController.loginUser, controller.myTours);
// router.get('/*', controller.error);

module.exports = router;
