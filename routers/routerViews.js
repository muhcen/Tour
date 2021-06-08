const express = require('express');

const controller = require('./../controller/viewController');
const authController = require('./../controller/authController');

const router = express.Router();

router.get('/', authController.loginUser, controller.overview);
router.get('/tour/:slug', authController.loginUser, controller.getTour);
router.get('/login', authController.loginUser, controller.login);
router.get('/Me', authController.loginUser, controller.account);
// router.get('/*', controller.error);

module.exports = router;
