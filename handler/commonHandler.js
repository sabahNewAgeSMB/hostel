var commonDao = require("../dao/commonDao");
var config = require("../routes/config/config");
var express = require("express");
var multer = require("multer");
const stream = require('stream');
const FCM = require('fcm-push');
let fcm = new FCM(config.fcm_key);

// var upload = multer({ dest: 'uploads/' })

var fc_imagepath = config.path.fc_imagepath;
var base_imagepath = config.path.base_imagepath;
var multer = require("multer");
var crypto = require("crypto");

var userControler = {};

userControler.loginCheck = (req, res, next) => {
  let params = req.body;
  // $result = $this->client_model->login($_POST);
  // $fbid = $arr['fb_token'];
  // 	$device_token = $arr['device_token'];
  // 	$longitude = $arr['longitude'];
  // 	$latitude = $arr['latitude'];
  // 	$friend_fb_ids = $arr['friend_fb_ids'];
  // 	$frndid_count = $arr['frndid_count'];
  if (
    params.fb_token &&
    params.first_name &&
    params.latitude &&
    params.longitude &&
    params.user_id
  ) {
    commonDao
      .loginCheck(params)
      .then(result => {
        return commonDao.delete_userfriends(result);
      })
      // .then( userControler.upload)
      .then(result => {
        let response = {};
        response.status = true;
        response.message = "User found";
        response.data = result;
        response.function = "login_check";
        res.send(response);
      })
      .catch(function(err) {
        let response = {};
        response.status = false;
        response.message = err;
        response.function = "login_check";
        res.send(response);
      });
  } else {
    let response = {};
    response.status = false;
    response.message = "No fb token";
    response.function = "login_check";
    res.send(response);
  }
};
userControler.register = (req, res, next) => {
  console.log("Innnnnnnnnn");
  let params = req.body;
  console.log("Innnnnnnnnn", params);
  if (params.user_id == "") {
    commonDao
      .register(params)
      .then(result => {
        let response = {};
        response.status = true;
        response.message = "User registered successfully";
        response.data = result;
        // response.function = "login_check";
        res.send(response);
      })
      .catch(() => {
        let response = {};
        response.status = false;
        response.message = "user present";
        // response.function = "login_check"
        res.send(response);
      });
  }
};
userControler.clear_notification = (req, res, next) => {
  let params = req.body;
  commonDao
    .clear_notification(params)
    .then(result => {
      let response = {};
      response.status = true;
      response.message = "notification cleared";
      response.data = result;
      // response.function = "login_check";
      res.send(response);
    })
    .catch(() => {
      let response = {};
      response.status = false;
      response.message = "failed";
      // response.function = "login_check"
      res.send(response);
    });
};
userControler.logout = (req, res, next) => {
  console.log("hiiii");
  let params = req.body;
  commonDao
    .logout(params)
    .then(result => {
      let response = {};
      response.status = true;
      response.message = "logged out";
      response.data = result;
      // response.function = "login_check";
      res.send(response);
    })
    .catch(() => {
      let response = {};
      response.status = false;
      response.message = "failed";
      // response.function = "login_check"
      res.send(response);
    });
};
userControler.save_userfriends_normal = (req, res, next) => {
  let params = req.body;
  commonDao
    .save_userfriends_normal(params)
    .then(result => {
      let response = {};
      response.status = true;
      response.message = "logged out";
      response.data = result;
      // response.function = "login_check";
      res.send(response);
    })
    .catch(() => {
      let response = {};
      response.status = false;
      response.message = "failed";
      // response.function = "login_check"
      res.send(response);
    });
};
userControler.delete_userfriends_normal = (req, res, next) => {
  console.log("hiiii");
  let params = req.body;
  commonDao
    .delete_userfriends_normal(params)
    .then(result => {
      let response = {};
      response.status = true;
      response.message = "deleted";
      response.data = result;
      // response.function = "login_check";
      res.send(response);
    })
    .catch(() => {
      let response = {};
      response.status = false;
      response.message = "failed";
      // response.function = "login_check"
      res.send(response);
    });
};

userControler.showAllNotifications = (req, res, next) => {
  let params = req.body;
  let user_id = params.user_id;
  console.log("hiiii", params);

  commonDao.showAllNotifications(params).then(result => {
    let Notification_list = result;
    console.log("Notification_list", Notification_list);
    for (var i = 0; i < Notification_list.length; i++) {
      if ($Notification_list[i]["notify_type"] == "4") {
        msg = commonDao.get_workout_details(result);
        workout_date_time = date(
          "D M jS @ g:i a",
          strtotime(msg["workout_date_time"])
        );
        Notification_list[i]["message"] = $Notification_list[$][
          "message"
        ].append(" ").workout_date_time;
        Notification_list[i]["user_name"] = "";
        Notification_list[i]["workout"] = msg["title"];
        Notification_list[i]["link_id"] = Notification_list[i]["file_id"];
      } else if (Notification_list[i]["notify_type"] == "2") {
        msg = commonDao.get_workout_details(result);
        if (msg["title"] != "") {
          Notification_list[i]["message"] = Notification_list[i][
            "message"
          ].append(" ").msg["title"];
        }
        Notification_list[i]["link_id"] = Notification_list[i]["performer_id"];
      } else if ($Notification_list[i]["notify_type"] == "3") {
        Notification_list[i]["link_id"] = Notification_list[i]["file_id"];
      } else if (Notification_list[i]["notify_type"] == "1") {
        Notification_list[i]["link_id"] = Notification_list[i]["file_id"];
      } else if (Notification_list[i]["notify_type"] == "5") {
        Notification_list[i]["link_id"] = Notification_list[i]["performer_id"];
      }

      Notification_list[i]["time_ago"] = commonDao.timeAgo(result);
    }
  });

  notification_count = Notification_list.length;
  console.log("Notification_list : ", Notification_list);
  commonDao
    .showAllNotifications(params)
    .then(commonDao.updateNotification)
    .then(result => {
      let response = {};
      response.status = true;
      //  response.message = "deleted";
      response.data = result;
      // response.function = "login_check";
      res.send(response);
    })
    .catch(() => {
      let response = {};
      response.status = false;
      response.message = "failed";
      // response.function = "login_check"
      res.send(response);
    });
};

userControler.getAllcategories = (req, res, next) => {
  console.log("hiiii");
  let params = req.body;
  commonDao
    .getAllcategories(params)
    .then(result => {
      let response = {};
      response.status = true;
      response.message = "success";
      response.data = result;
      // response.function = "login_check";
      res.send(response);
    })
    .catch(() => {
      let response = {};
      response.status = false;
      response.message = "failed";
      // response.function = "login_check"
      res.send(response);
    });
};

userControler.delete_workout = (req, res, next) => {
  console.log("hiiii");
  let params = req.body;
  workout_id = params.workout_id;
  commonDao
    .delete_workout(params)
    .then(commonDao.delete_workout2)
    .then(commonDao.delete_workout3)
    .then(result => {
      let response = {};
      response.status = true;
      response.message = "success";
      response.data = result;
      res.send(response);
    })
    .catch(err => {
      let response = {};
      response.status = false;
      response.message = "failed";
      res.send(response);
    });
};

commonDao.get_contact_list = params => {
  //did not check
  let member_details = {};
  member_details["fb_token"] = "1453515144871088";
  image = "https://graph.facebook.com/".member_details["fb_token"].append(
    "/picture?width=140&height=140"
  );
  //  https://graph.facebook.com/v2.2/me?access_token=CAACEdEose0cBAPMa1poydFI1DxPDDaXrB5iZBcgAJt9K64ErGhwA78QR825Wq9yCi50Y4TUGHkCiGX8f0Ru4DOlZBTchxuao9L8g9TsFpYuKVKsPflDdvUB7SB6iKux7Na8Cv1ZCvg7jNbn2dYyQoZBQe9DOxnsmIWtjMycqWNCT65Cz3pZClLbjX7vK80N3F0TqnH5dFvZBbzZB9XTbEmm/
};

userControler.add_friend_request = (req, res, next) => {
  let params = req.body;
  let result_array = {};
  if (params.user_id && params.friend_id) {
    commonDao
      .check_friend_status(params)
      .then(result => {
        if (result.length > 0) {
          return commonDao.remove_friend_request(params);
        } else {
          return commonDao.add_friend_request(params);
        }
      })
      .then(result => {
        if (result.delete_status && result.delete_status == true) {
          //manasilayilla
          throw "Request removed Successfully";
        } else {
          result_array.request_friend_id = result;
          return commonDao.get_user_details(params);
        }
      })
      .then(result => {
        let response = {};
        response.status = true;
        response.message = "Request sent Successfully";
        response.request_friend_id = result_array.request_friend_id;
        res.send(response);
      })
      .catch(err => {
        let response = {};
        response.status = false;
        response.message = err;
        res.send(response);
      });
  } else {
    let response = {};
    response.status = false;
    response.message = "Invalid input field";
    res.send(response);
  }
};

userControler.join_toggle = (req, res, next) => {
  //not proper need to change
  let params = req.body;
  let result_array = {};
  if (params.user_id && params.id) {
    commonDao
      .check_joined_status(params)
      .then(result => {
        if (result.length > 0) {
          return commonDao.unjoin_workout(params);
        } else {
          return commonDao.join_workout(params);
        }
      })
      .then(result => {
        if (result.delete_status && result.delete_status == true) {
          //did not get
          throw "Request removed Successfully";
        } else {
          result_array.request_friend_id = result;
          return commonDao.get_user_details(params);
        }
      })
      .then(result => {
        let response = {};
        response.status = true;
        response.message = "Request sent Successfully";
        response.request_friend_id = result_array.request_friend_id;
        res.send(response);
      })
      .catch(err => {
        let response = {};
        response.status = false;
        response.message = err;
        res.send(response);
      });
  } else {
    let response = {};
    response.status = false;
    response.message = "Invalid input field";
    res.send(response);
  }
};

userControler.join_workout = (req, res, next) => {
  //not completed
  // console.log("hiiii");
  let params = req.body;
  if (params.user_id && params.id) {
    commonDao.check_joined_status(params).then(result => {
      if (result.length > 0) {
        console.log("workinggg");
        return commonDao
          .unjoin_workout(result)
          .then(commonDao.unjoin_workout2)
          .then(commonDao.unjoin_workout3)
          .then(result => {
            let response = {};
            response.status = true;
            response.message = "unjoined";
            response.data = result;
            res.send(response);
          })
          .catch(err => {
            let response = {};
            response.status = false;
            response.message = err;
            res.send(response);
          });
      } else {
        return commonDao.get_details(params).then(params => {
          if (params.device_token != "") {
            commonDao
              .update_iphone_notification(params)
              // .then(commonDao.sendPushNotification)

              .then(commonDao.update_iphone_notification2)
              .then(commonDao.join_workout)
              .then(commonDao.join_workout2)
              .then(result => {
                console.log("workimgggg");
                let response = {};
                response.status = true;
                response.message = "joined";
                response.data = result;
                res.send(response);
              })
              .catch(err => {
                let response = {};
                response.status = false;
                response.message = err;
                res.send(response);
              });
          }
        });
      }
    });
  }
};

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, fc_imagepath);
  },
  filename: function(req, file, cb) {
    var expt = file.originalname.split(".");
    crypto.pseudoRandomBytes(16, function(err, raw) {
      cb(null, raw.toString("hex") + Date.now() + "." + expt[1]);
    });
  }
});

userControler.upload = multer({
  storage: storage
});

userControler.post_workout = (req, res, next) => {
  let params = req.body;

  params.image =
    typeof req.file == "undefined"
      ? (params.image = "")
      : (params.image = req.file.filename);

  if (params.workout_id == "") {
    commonDao
      .create_workout(params)
      .then(result => {
        let response = {};
        response.status = true;
        response.message = "Request sent Successfully";
        response.request_friend_id = result.request_friend_id;
        res.send(response);
      })
      .catch(err => {
        console.log("ERRR", err);
        let response = {};
        response.status = false;
        response.message = "sorry couldnt send request1";
        res.send(response);
      });
  } else {
    commonDao
      .update_workout(params)
      .then(result => {
        let response = {};
        response.status = true;
        response.message = "Request sent Successfully1";
        response.request_friend_id = result.request_friend_id;
        res.send(response);
      })
      .catch(err => {
        console.log("ERRR", err);
        let response = {};
        response.status = false;
        response.message = "sorry couldnt send request1";
        res.send(response);
      });
  }
};

userControler.get_workout_details = (req, res, next) => {
  let params = req.body;
  if (params.workout_id && typeof params.workout_id != "undefined") {
    commonDao
      .get_workout_details(params)
      .then(result => {
        let response = {};
        response.status = true;
        response.message = "success";
        response.data = result;
        res.send(response);
      })
      .catch(err => {
        console.log("ERRR", err);
        let response = {};
        response.status = false;
        response.message = "error";
        res.send(response);
      });
  } else {
    let response = {};
    response.status = false;
    response.message = "Invalid parameters.";
    res.send(response);
  }
};


userControler.send_push_notification = ((req, res, next) => {
  let params = req.body;
  userControler.send_push(params.device_token, params.notification_data)
  .then((result) => {
    let response = {};
    response.status = true;
    response.message = "Done";
    res.send(response);
  })
});

userControler.send_push = function(device_token,notification_data) {
    let notification_datas=notification_data;
    notification_datas.sound="default";
    notification_datas.badge=1;
    let data_info=notification_data;
    data_info.channelId="HM001235";
    
    
    var message = {
        to: device_token, // required fill with device token or topics
        collapse_key: 'newage', 
       /*  data: {
            your_custom_data_key: 'your_custom_data_value'
        },
        notification: {
            title: 'Title of your push notification',
            body: 'Body of your push notification'
        } */
    
        data: notification_data,
        notification: notification_datas

        
    };

        //promise style
    fcm.send(message)
    .then(function(response){
        console.log("Successfully sent with response: ", response);
    })
    .catch(function(err){
        console.log("Something has gone wrong!");
        console.error(err);
    })


   }



   userControler.group_workout1 = ((req, res, next) => {
    let params = req.body;
    let response = {
        function:"group_workout",
        message:'',
        data:{},
        status:''
    };

    if ( params.user_id && typeof params.group_id !='undefined') {
      commonDao.group_workout1(params.group_id)
            .then((result) => {
              response.data=result;
              res.send(response);
            })
                .catch((err) => {
                response.status = false;
                response.message = err;
                common.logError(response.function, req.body, err);
                res.send(response);
            });
    } else {
        response.status = false;
        response.message = "error";
        // common.logError(response.function, req.body, config.message.invalidParameters);
        res.send(response);
    }
});

userControler.stripe_payment_card = ((req, res, next) => {
  
  var stripe = require("stripe")("sk_test_L1DCMWAsRaqSWM3CSce5BFZk");

  stripe.charges.create({
    amount: 2000,
    currency: "usd",
    source: "tok_visa", // obtained with Stripe.js
    metadata: {'order_id': '6735'}
  },function(err, token) {
      // asynchronously called
      let response = {}
      response.err = err;
      response.token = token;
      res.send(response);
   
  
})
})
// userControler.stripe_payment_card2= ((req, res, next) => {
// var stripe = require("stripe")("sk_test_L1DCMWAsRaqSWM3CSce5BFZk");

// stripe.tokens.create({
//   card: {
//     "number": '4000056655665556',
//     "exp_month": 12,
//     "exp_year": 2019,
//     "cvc": '123'
//   }

// }, function(err, token) {
//   // asynchronously called
//   let response = {}
//   response.err = err;
//   response.token = token;
//   res.send(response);
// });
// })
userControler.stripe_create_subscription = ((req, res, next) => {
var stripe = require("stripe")("sk_test_L1DCMWAsRaqSWM3CSce5BFZk");

stripe.subscriptions.create({
  customer: "cus_EU9jFbiIUoUPON",
  items: [
    {
      plan: "plan_EU9nlfwE8Ime25",
    },
  ]
}, function(err, subscription) {
    // asynchronously called
    let response = {}
  response.err = err;
  response.subscription = subscription;
  res.send(response);
  }
);
})
userControler.stripe_create_customer = ((req, res, next) => {
var stripe = require("stripe")("sk_test_L1DCMWAsRaqSWM3CSce5BFZk");

stripe.customers.create({
  description: 'Customer for jenny.rosen@example.com',
  source: "tok_visa" // obtained with Stripe.js
}, function(err, customer) {
  // asynchronously called
  let response = {}
  response.err = err;
  response.customer = customer;
  res.send(response);
});
})
userControler.stripe_create_plan = ((req, res, next) => {
var stripe = require("stripe")("sk_test_L1DCMWAsRaqSWM3CSce5BFZk");

stripe.plans.create({
  amount: 5000,
  interval: "month",
  product: {
    name: "Gold special"
  },
  currency: "usd",
}, function(err, plan) {
  // asynchronously called
  let response = {}
  response.err = err;
  response.plan = plan;
  res.send(response);
});
})
userControler.stripe_update_subscriptions = ((req, res, next) => {
var stripe = require("stripe")("sk_test_L1DCMWAsRaqSWM3CSce5BFZk");

stripe.subscriptions.update(
  "sub_EU9oMvqYxhpREe",
  { tax_percent: 10 },
  function(err, subscription) {
    // asynchronously called
    let response = {}
  response.err = err;
  response.subscription = subscription;
  res.send(response);
  }
);
})
userControler.stripe_create_bankacc = ((req, res, next) => {
var stripe = require("stripe")("sk_test_L1DCMWAsRaqSWM3CSce5BFZk");

stripe.accounts.createExternalAccount(
  "acct_1E0T0WKX0Y7dqprB",
  { external_account: "btok_1E1Br6KX0Y7dqprB3WZMKWnA" },
  function(err, bank_account) {
    // asynchronously called
    let response = {}
  response.err = err;
  response.bank_account = bank_account;
  res.send(response);
  }
);
})
userControler.stripe_create_coupon = ((req, res, next) => {
var stripe = require("stripe")("sk_test_L1DCMWAsRaqSWM3CSce5BFZk");

stripe.coupons.create({
  percent_off: 25,
  duration: 'repeating',
  duration_in_months: 3,
  id: '25OFF'
}, function(err, coupon) {
  // asynchronously called
  let response = {}
  response.err = err;
  response.coupon = coupon;
  res.send(response);
});
})
userControler.stripe_create_topup = ((req, res, next) => {
var stripe = require("stripe")("sk_test_L1DCMWAsRaqSWM3CSce5BFZk");

stripe.topups.create({
  amount: 2000,
  currency: 'usd',
  description: 'Top-up for Jenny Rosen',
  statement_descriptor: 'Stripe top-up'
}, function(err, topup) {
  // asynchronously called
  let response = {}
  response.err = err;
  response.topup = topup;
  res.send(response);
});
})
module.exports = userControler;


