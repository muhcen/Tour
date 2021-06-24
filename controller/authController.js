const User = require('./../models/usersModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('./../utils/sendEmail');
const crypto = require('crypto');

const { clearCache } = require('../utils/casheServer');
const createToken = (id, res, req) => {
    const token = jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: process.env.EXPIRES_IN,
    });

    res.cookie('jwt', token, {
        expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        status: 'success',
        token,
    });
};
exports.signUp = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body);
    await createToken(user._id, res);

    req.user = user;
});

exports.login = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (!user || !(await user.comparePass(req.body.password, user.password))) {
        return next(new AppError('email or password is not correct , please try again', 400));
    }

    await createToken(user._id, res);

    req.user = user;
});

exports.logOut = catchAsync(async (req, res, next) => {
    res.cookie('jwt', 'LogOut', {
        expiresIn: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        status: 'success',
    });
});

exports.loginUser = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const token = await jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);
            if (!token) {
                return next();
            }

            const user = await User.findById(token.id).select('+password');

            if (!user) {
                return next();
            }
            res.locals.user = user;
            req.user = user;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
};

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = await req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    await jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
        if (err) {
            return next(new AppError('token is not valid , try again ', 500));
        }
        token = decode;
    });

    if (!token) {
        return next(new AppError('token is not valid , try again ', 500));
    }
    const user = await User.findById(token.id).select('+password');

    if (!user) {
        return next(new AppError('user is not found , try again ', 500));
    }
    req.user = user;
    next();
};

exports.changePassword = catchAsync(async (req, res, next) => {
    const { password, newPassword, newPasswordConfirm } = req.body;
    if (!password || !newPassword || !newPasswordConfirm) {
        return next(new AppError('please enter password,newPassword and newPasswordConfirm'), 404);
    }
    const currentUser = await req.user.comparePass(password, req.user.password);
    if (!currentUser) {
        return next(new AppError('password is not correct', 404));
    }

    let user = await User.findById(req.user._id).select('-password');
    await user.changePassword(newPassword, newPasswordConfirm);
    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'password change',
        data: {
            user,
        },
    });
});

exports.inactive = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    user.inactiveAcc();
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
        status: 'message',
        user,
    });
});

exports.active = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const yes = req.body.yes || 0;

    if (!user.inactive) {
        return next(new AppError("your account is active . don't worry :)"));
    }
    if (user.inactiveTime.getTime() < Date.now()) {
        await User.findByIdAndDelete(req.user._id);
        return res.status(200).json({
            time: 'your account for ever expires. sign up again',
        });
    }

    if (yes) {
        user.activeAcc();
        user.save({ validateBeforeSave: false });
        return res.status(200).json({
            status: `your account come back`,
            user,
        });
    } else {
        return res.status(200).json({
            time: `${
                user.inactiveTime.getTime() - Date.now()
            } until your account expires if don't like dis enter (yes)`,
        });
    }
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError('email not exist. please sign up'));
    }
    const hash = user.createHash();

    sendEmail({
        from: '"mohsen 👻" <mohsen@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'reset password ✔', // Subject line
        text: `for reset password click on 127.0.0.1:8000/api/v1/users/${hash}`,
    });
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
        status: 'email send. please check your email',
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const { password, passwordConfirm } = req.body;
    if (!password || !passwordConfirm) {
        return next(new AppError('please enter password and passwordConfirm'));
    }
    const cryptoHash = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ hash: cryptoHash });

    if (!user) {
        return next(new AppError('token is not correct'));
    }
    if (user.hashCreateAt < Date.now()) {
        return next(new AppError('try again ! after 10m token expired'));
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.hash = undefined;
    user.hashCreateAt = undefined;
    user.passwordChangeAt = new Date();
    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'password is change',
    });
});

exports.checkAccess = (...who) => {
    return async (req, res, next) => {
        const user = await User.findById(req.user._id);
        if (!who.includes(user.role)) {
            return next(new AppError('you can not access this route'));
        }
        next();
    };
};

exports.delCache = catchAsync(async (req, res, next) => {
    await next();
    clearCache(req.user._id);
});
