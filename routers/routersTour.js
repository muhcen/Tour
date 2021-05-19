const express = require('express');
const controller = require('./../controller/tourController');
const authController = require('./../controller/authController');
const reviewController = require('./../controller/reviewController');
const reviewRouter = require('./../routers/routersReview');
const router = express.Router();

router.route('/top-5-cheap').get(controller.top5cheap);
router
    .route('/')
    .get(
        authController.protect,
        authController.checkAccess('admin', 'user'),
        controller.pageAndLimit,
        controller.getAllTours,
    )
    .post(authController.protect, authController.delCache, controller.createTour);
router
    .route('/:id')
    .get(authController.protect, controller.getTour)
    .patch(
        authController.protect,
        authController.delCache,
        controller.uploadTourPhoto,
        controller.showUpload,
        controller.updateTour,
    )
    .delete(
        authController.protect,
        authController.delCache,
        authController.checkAccess('admin'),
        controller.deleteTour,
    );

router.route('/order').post(authController.protect, controller.createOrder);

router.use('/:id/reviews', reviewRouter);

module.exports = router;
