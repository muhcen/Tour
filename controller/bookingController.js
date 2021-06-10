const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Tour = require('./../models/toursModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Booking = require('./../models/bookingsModel');

exports.checkOutSession = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${tour.id}&user=${
            req.user.id
        }&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.id,
        line_items: [
            {
                name: tour.name,
                description: tour.description,
                images: [`http://127.0.0.1:8000/img/tours/${tour.imageCover}`],
                amount: tour.price * 1000,
                currency: 'usd',
                quantity: 1,
            },
        ],
    });

    res.status(200).json({
        session,
    });
});

exports.createBooking = catchAsync(async (req, res, next) => {
    const { tour, price, user } = req.query;

    if (!tour && !price && !user) return next();

    await Booking.create({ tour, price, user });

    res.redirect(req.originalUrl.split('?')[0]);

    next();
});
