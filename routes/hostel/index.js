var express = require('express');
var router = express.Router();

var user = require('./user/userControler');
var token = require('../config/token');


router.get('/', function (req, res, next) {
    res.render('hostel/index', {
        name: 'Hostel'
    });
});

router.post('/login', user.loginCheck);
router.post('/create_update_user', token.verify, user.createUpdateUser);
router.post('/user_details', token.verify, user.userDetails);

module.exports = router;