var express = require("express");
var router = express.Router();
var commonHandler = require("../handler/commonHandler");
// var express = require('express')
var multer = require("multer");
var io = require('socket.io')(http);
var stripe = require("stripe");
// var upload = multer({ dest: 'uploads/' })
// var app = express()
/* GET home page. */
// router.get("/", function(req, res, next) {
//   res.render("index", {
//     title: "Express"
//   });
// });



var router = require('express')();
var http = require('http').Server(router);

router.get('/chat', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', function(socket){
  console.log('a user connected');
})
http.listen(3000, function(){
  console.log('listening on *:3000');
});

// router.get('/developer', function (req, res, next) {
//   res.render('developer', {
//     title: 'Developer Details',
//     url : '10.10.10.88:3000',
//     node_version : process.version
//   });
// });

router.post(
  "/login",
  commonHandler.upload.single("image"),
  commonHandler.loginCheck
);
router.post("/register", commonHandler.register);
router.post("/clear_notification", commonHandler.clear_notification);
router.post("/logout", commonHandler.logout);
router.post(
  "/delete_userfriends_normal",
  commonHandler.delete_userfriends_normal
);
router.post("/show_all_notifications", commonHandler.showAllNotifications);
router.post("/get_all_categories", commonHandler.getAllcategories);
router.post("/delete_workout", commonHandler.delete_workout);
router.post("/add_friend_request", commonHandler.add_friend_request);
router.post("/join_workout", commonHandler.join_workout);
router.post("/send_push", commonHandler.send_push_notification);
router.post("/group_workout1", commonHandler.group_workout1);
router.post("/stripe_payment_card", commonHandler.stripe_payment_card);
router.post("/stripe_create_subscription", commonHandler.stripe_create_subscription);
router.post("/stripe_create_customer", commonHandler.stripe_create_customer);
router.post("/stripe_create_plan", commonHandler.stripe_create_plan);
router.post("/stripe_update_subscriptions", commonHandler.stripe_update_subscriptions);
router.post("/stripe_create_bankacc", commonHandler.stripe_create_bankacc);
router.post("/stripe_create_coupon", commonHandler.stripe_create_coupon);
router.post("/stripe_create_topup", commonHandler.stripe_create_topup);


router.post(
  "/upload",
  commonHandler.upload.single("image"),
  (req, res, next) => {
    res.send(req.file);
  }
);
router.post(
  "/post_workout",
  commonHandler.upload.single("image"),
  commonHandler.post_workout
);
// router.post('/test', (req, res, next) => { res.send("test")});
router.post(
  "/get_workout_details",
  commonHandler.upload.single("image"),
  commonHandler.get_workout_details
);

module.exports = router;
