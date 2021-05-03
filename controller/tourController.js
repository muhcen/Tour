const Tour = require("../models/toursModel");
const Order = require("../models/orderModel");

const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./factoryController");
const multer = require("multer");
exports.pageAndLimit = (req, res, next) => {
  const page = req.query.page * 1 || 1;
  req.limit = req.query.limit * 1 || 10;
  req.skip = (page - 1) * req.limit;
  next();
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/tours");
  },
  filename: function (req, file, cb) {
    const exe = file.mimetype.split("/")[1];
    cb(null, `tours-${req.user.id}-${Date.now()}.${exe}`);
  },
});

const filter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("you must upload image.", 400), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filter,
});

exports.uploadTourPhoto = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

exports.showUpload = catchAsync(async (req, res, next) => {
  req.body.images = [];
  if (req.files.imageCover)
    req.body.imageCover = req.files.imageCover[0].filename;
  if (req.files.images)
    await Promise.all(
      req.files.images.map((file) => {
        req.body.images.push(file.filename);
      })
    );

  next();
});
exports.createTour = factory.createOne(Tour);
exports.getAllTours = factory.getAllOne(Tour);
exports.getTour = factory.getOne(Tour, "reviews");
exports.deleteTour = factory.deleteOne(Tour);

exports.top5cheap = catchAsync(async (req, res, next) => {
  const tour = await Tour.aggregate([{ $sort: { price: -1 } }, { $limit: 5 }]);
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (req.body.name) {
    tour.createSlug(req.body.name);
    await tour.save();
  }
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;

  const order = await Order.create(req.body);
  console.log(order);
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});
