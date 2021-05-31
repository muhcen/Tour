const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const AppError = require('./utils/appError');
const cookiesParser = require('cookie-parser');
const errorHandler = require('./controller/errorController');

const host = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
require('./utils/casheServer');

mongoose.connect(
    host,
    {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },
    () => {
        console.log('database(mongoose) is ready');
    },
);

app.use(
    express.json({
        limit: '10kb',
    }),
);
app.use(cookiesParser());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const routerViews = require('./routers/routerViews');
const routerTours = require('./routers/routersTour');
const routerUsers = require('./routers/routerUser');
const routerReviews = require('./routers/routersReview');
const routerBookings = require('./routers/routersBookings');

app.use('/', routerViews);
app.use('/api/v1/tours', routerTours);
app.use('/api/v1/users', routerUsers);
app.use('/api/v1/reviews', routerReviews);
app.use('/api/v1/bookings', routerBookings);

app.all('*', (req, res, next) => {
    next(new AppError(`can not find ${req.originalUrl} route`, 404));
});

app.use(errorHandler);

module.exports = app;
