const express = require('express');

const authController = require('./../controller/authController');
const bookingController = require('./../controller/bookingController');
const router = express.Router();

router.get('/checkOut-session/:id', authController.protect, bookingController.checkOutSession);

module.exports = router;
