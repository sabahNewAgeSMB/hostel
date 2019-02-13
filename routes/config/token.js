var jwt = require('jsonwebtoken');
var config = require('./config');

var token = {};

token.signer = function (res, userData) {
        return new Promise(function (resolve, reject) {
            try {
                let data = {
                    user_id: userData.user_id,
                    username: userData.username,
                    email: userData.email
                };
                var jwtToken = jwt.sign({
                    data: data
                }, config.jwtAuthSecret, {
                    expiresIn: 3600 // expires in 1 hour
                });
                res.header('auth_token', jwtToken);

                // decode jwt token
                // var details = jwt.decode(jwtToken, config.jwtAuthSecret);
                // res.header('ssssssssss', JSON.stringify(details),);
                // Sample structure
                // {"data":{"user_id":1,"username":"Krish","email":"krish@mailinator.com"},"iat":1541593309,"exp":1541596909}

                resolve(userData);
            } catch (err) {
                reject(err);
            }

        });
    };

token.refreshSign = function (res, userData) {
    return new Promise(function (resolve, reject) {
        try {
            let data = {
                user_id: userData.user_id,
                username: userData.username,
                email: userData.email
            };
            var jwtToken = jwt.sign({
                data: data
            }, config.jwtRefreshSecret, {
                expiresIn: 86400 // expires in 1 day
            });
            res.header('refresh_token', jwtToken);
            resolve(userData);
        } catch (err) {
            reject(err);
        }
    });
};

token.verify = function (req, res, next) {
    let jwtToken = req.query.authorization || req.headers.authorization;
    try {
        var verifyCode = jwt.verify(jwtToken, config.jwtAuthSecret);
        if (verifyCode.data) {
            if (verifyCode.data.user_id && verifyCode.data.username && verifyCode.data.email) {
                req.user_id = verifyCode.data.user_id;
                req.username = verifyCode.data.username;
                req.email = verifyCode.data.email;
                res.header('authentication', 'true');
                res.header('auth_token', jwtToken);
                next();
            } else {
                res.header('authentication', 'false');
                res.send({
                    'status': false,
                    'message': config.message.authFailure
                });
            }
        }
    } catch (err) {
        if (err.name && err.name == 'TokenExpiredError') {
            try {
                let RefreshToken = req.headers.refreshtoken;
                var refreshCode = jwt.verify(RefreshToken, config.jwtRefreshSecret);
                if (refreshCode.data) {
                    if (refreshCode.data.user_id && refreshCode.data.username && refreshCode.data.email) {
                        req.user_id = refreshCode.data.user_id;
                        req.username = refreshCode.data.username;
                        req.email = refreshCode.data.email;
                        res.header('authentication', 'true');
                        token.signer(res, refreshCode.data)
                        .then((result) => {
                            return token.refreshSign(res, refreshCode.data);
                        })
                        .then((result) => {
                            next();
                        }).
                        catch(function (err) {
                            res.header('authentication', 'false');
                            res.send({
                                'status': false,
                                'message': config.message.authTokenCreateFailure
                            });
                        });
                    } else {
                        res.send({
                            'status': false,
                            'message': config.message.authFailure
                        });
                    }
                } else {
                    res.send({
                        'status': false,
                        'message': config.message.authFailure
                    });
                }
            } catch (err) {
                res.header('authentication', 'false');
                let response = {
                    'status': false,
                    'message': config.message.authFailure
                };
                res.send(response);
            }
        } else {
            res.header('authentication', 'false');
            let response = {
                'status': false,
                'message': config.message.authFailure
            };
            res.send(response);
        }
    }
};

module.exports = token;