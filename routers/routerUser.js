const express = require('express');

const controller = require('./../controller/authController');
const userController = require('./../controller/userController');
const router = express.Router();

router.post('/signUp', controller.signUp);
router.post('/login', controller.login);
router.get('/logOut', controller.logOut);

router.patch('/changePassword', controller.protect, controller.changePassword);
router.delete('/inactive', controller.protect, controller.inactive);
router.post('/active', controller.protect, controller.active);
router.post('/forgetPassword', controller.forgetPassword);
router.post('/resetPassword/:token', controller.resetPassword);
router.post('/uploadMe', controller.loginUser, userController.uploadPhoto, userController.uploadMe);

router.route('/').get(userController.getAllUsers);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
