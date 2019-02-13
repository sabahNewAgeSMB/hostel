var config = require('./config');
var database = require('./database')(config.database);
var moment = require('moment');

var common = {};

common.loginCheck = (params) => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM h_user_master U WHERE U.email = ? AND U.password = ?';
        let data = [params.email, params.password];
        database.select(query, data).then((result) => {
            if (Array.isArray(result) && result.length > 0) {
                resolve(result[0]);
            } else {
                reject(config.message.loginCheck);
            }
        }).catch(function (err) {
            reject(err);
        });
    });
};
common.logError = function (function_name, params, log) {
    return new Promise((resolve, reject) => {
        let data = {
            function_name: function_name,
            params: JSON.stringify(params),
            log: log,
            created: moment().utcOffset("+05:30").format('YYYY-MM-DD hh:mm:ss')
        };
        database.insert("h_err_log", data).then((result) => {
            resolve(result);
        }).catch(function (err) {
            resolve(err);
        });
    });
};

module.exports = common;