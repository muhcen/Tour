const Review = require("./../models/reviewsModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./factoryController");
const { clearCache } = require("../utils/casheServer");

exports.getReview = factory.getOne(Review);
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user._id });
  res.status(200).json({
    status: "success",
    data: {
      reviews,
    },
  });
});
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.createReview = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  const review = await Review.create(req.body);
  clearCache(req.user._id);

  res.status(201).json({
    status: "success",
    data: {
      review,
    },
  });
});
