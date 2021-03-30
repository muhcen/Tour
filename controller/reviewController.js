const Review = require("./../models/reviewsModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./factoryController");

exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAllOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.createReview = catchAsync(async (req, res, next) => {
  req.body.tour = req.params.id;
  req.body.user = req.user._id;
  const review = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      review,
    },
  });
});
