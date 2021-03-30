const express = require("express");
const bookingsController = require("./../controller/bookingsController");
const authController = require("./../controller/authController");
const router = express.Router();

router.get(
  "/checkout-session/:tourId",
  authController.protect,
  bookingsController.checkoutSession
);

module.exports = router;
