const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const User = require("./../models/usersModel");
const factory = require("./../controller/factoryController");
const multer = require("multer");

exports.getAllUsers = factory.getAllOne(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/users");
  },
  filename: function (req, file, cb) {
    const exe = file.mimetype.split("/")[1];
    console.log(exe);
    cb(null, `user-${req.user.id}-${Date.now()}.${exe}`);
    console.log(exe);
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

exports.uploadPhoto = upload.single("photo");
exports.uploadMe = catchAsync(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  if (req.file) req.body.photo = req.file.filename;
  const newUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    next: true,
    runValidators: false,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const newUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    newUser,
  });
});
