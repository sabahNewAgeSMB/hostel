var config = require('../../config/config');
var database = require('../../config/database')(config.database);

var userModel = {};

userModel.usernameExist = function (params) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM h_user_master U WHERE U.username = ?";
        let username = params.username;
        let data = [username];
        database.select(query, data).then((result) => {
            if (Array.isArray(result) && result.length > 0) {
                reject(config.message.usernameExist);
            } else {
                resolve(params);
            }
        }).catch(function (err) {
            reject(err);
        });
    });
};

userModel.emailExist = function (params) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM h_user_master U WHERE U.email = ?";
        let email = params.email;
        let data = [email];
        database.select(query, data).then((result) => {
            if (Array.isArray(result) && result.length > 0) {
                reject(config.message.emailExist);
            } else {
                resolve(params);
            }
        }).catch(function (err) {
            reject(err);
        });
    });
};

userModel.createUser = function (params) {
    return new Promise((resolve, reject) => {
        database.insert("h_user_master", params).then((result) => {
            resolve(result);
        }).catch(function (err) {
            reject(err);
        });

    });
};

userModel.updateUser = function (params) {
    return new Promise((resolve, reject) => {
        let con = {
            key: "user_id",
            value: params.user_id
        };
        database.updateSingle("h_user_master", params, con).then((result) => {
            resolve(result);
        }).catch(function (err) {
            reject(err);
        });

    });
};

userModel.userDetails = function (params) {
    return new Promise((resolve, reject) => {
        let data = [
            params.user_id
        ];

        let query = "SELECT * FROM h_user_master U WHERE U.`delete` IS NULL";
        if (typeof (params.user_id) != 'undefined' && params.user_id != '') {
            query += " AND U.user_id = ?";
        }
        console.log("query", query, data);
        database.select(query, data).then((result) => {
            resolve(result);
        }).catch(function (err) {
            reject(err);
        });
    });
};


module.exports = userModel;