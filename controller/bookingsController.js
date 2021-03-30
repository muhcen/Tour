const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("../models/toursModel");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./factoryController");

exports.checkoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  const checkout = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        currency: "usd",
        name: tour.name + "Tour",
        description: tour.description,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        quantity: 1,
      },
    ],
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
  });

  res.status(200).json({
    status: "success",
    data: {
      checkout,
    },
  });
});
