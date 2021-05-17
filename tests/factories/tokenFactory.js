const jwt = require('jsonwebtoken');

exports.tokenFactory = (id) => {
    const token = jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: process.env.EXPIRES_IN,
    });
    return token;
};
