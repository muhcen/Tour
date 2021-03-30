const express = require("express");
const controller = require("./../controller/tourController");
const authController = require("./../controller/authController");
const reviewController = require("./../controller/reviewController");
const reviewRouter = require("./../routers/routersReview");
const router = express.Router();

router.route("/top-5-cheap").get(controller.top5cheap);
router
  .route("/")
  .get(authController.protect, controller.pageAndLimit, controller.getAllTours)
  .post(controller.createTour);
router
  .route("/:id")
  .get(controller.getTour)
  .patch(
    authController.protect,
    controller.uploadTourPhoto,
    controller.showUpload,
    controller.updateTour
  )
  .delete(
    authController.protect,
    authController.checkAccess("admin"),
    controller.deleteTour
  );

router.use("/:id/reviews", reviewRouter);

module.exports = router;
