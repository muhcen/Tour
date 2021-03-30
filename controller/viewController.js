const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const Tour = require("./../models/toursModel");
const User = require("./../models/usersModel");

exports.overview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render("overview", {
    title: "Natours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate(
    "reviews"
  );
  if (!tour) {
    return next(new AppError("tour not find whit name", 400));
  }
  res.status(200).render("tour", {
    title: tour.name,
    tour,
  });
});
exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "login",
  });
});

exports.account = catchAsync(async (req, res, next) => {
  res.status(200).render("account", {
    title: "My Account",
  });
});

