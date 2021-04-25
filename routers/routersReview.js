const express = require("express");
const controller = require("./../controller/reviewController");
const authController = require("./../controller/authController");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(authController.protect,controller.getAllReviews)
  .post(authController.protect, controller.createReview);

router
  .route("/:id")
  .get(controller.getReview)
  .patch(controller.updateReview)
  .delete(controller.deleteReview);
module.exports = router;
