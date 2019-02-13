var config = require("../routes/config/config");
var database = require("../routes/config/database")(config.database);
var moment = require("moment");

var commonDao = {};

commonDao.loginCheck = params => {
  return new Promise((resolve, reject) => {
    let query = "SELECT * FROM user_master U WHERE U.fb_token = ?";
    let fb_token = params.fb_token;
    let data = [fb_token];
    database
      .select(query, data)
      .then(result => {
        if (Array.isArray(result) && result.length > 0) {
          resolve(result);
        } else {
          reject(config.message.loginCheck);
        }
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

commonDao.delete_userfriends = params => {
  return new Promise((resolve, reject) => {
    let query = "DELETE FROM user_friends WHERE user_id= ? AND type='FB'";
    let user_id = params.user_id;
    let data = [user_id];
  });
};
commonDao.register = params => {
  // console.log("Innnnnnnnnwwwwwwwn");
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO user_master WHERE first_name=? AND last_name=? and fb_token=? and email=? and username=? and device_token=? and longitude=?
        and latitude=? and about_me=? and push_notification='y' and join_date=?`;
    database
      .insert("user_master", params)
      .then(result => {
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

commonDao.getPlaceName = params => {
  let geocode = file_get_contents(
    "http://maps.googleapis.com/maps/api/geocode/json?latlng="
      .append(latitude)
      .append(longitude)
      .append("&sensor=false")
  );
  let output = json_decode(geocode);

  return new Promise((resolve, reject) => {
    resolve(output.results[0].formatted_address); // polygons[0].geometry.coordinates[0]
  });
};
commonDao.getlan_long = params => {
  let url = "http://maps.googleapis.com/maps/api/geocode/json?address="
    .urlencode($zip)
    .append("&sensor=false");
  result_string = file_get_contents(url);
  result = json_decode($result_string, true);
  result1 = result["results"][0];
  result2 = result1[0]["geometry"];
  result3 = result2[0]["location"];
  return new Promise((resolve, reject) => {
    resolve(result3); // polygons[0].geometry.coordinates[0]
  });
};
commonDao.clear_notification = params => {
  return new Promise((resolve, reject) => {
    let con = {
      key: "user_id",
      value: params.user_id
    };
    database
      .updateSingle("user_master", { iphone_noti_count: 0 }, con)
      .then(result => {
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};
//everything shows failed//
commonDao.logout = params => {
  return new Promise((resolve, reject) => {
    let con = {
      key: "user_id",
      value: params.user_id
    };
    database
      .updateSingle("user_master", { device_token: "" }, con)
      .then(result => {
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};
commonDao.save_userfriends_normal = params => {
  //need help
  return new Promise((resolve, reject) => {
    let con = {
      key: "fb_token",
      value: params.friend_user_id
    };
    let con1 = {
      key: "user_id",
      value: params.user_id
    };
    database
      .get_where("user_master", (params.device_token = ""), con)
      .then(result => {
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
    database
      .get_where("user_master", (params.device_token = ""), con)
      .then(result => {
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};
commonDao.delete_userfriends_normal = params => {
  return new Promise((resolve, reject) => {
    console.log("hiiiiii");
    let query =
      "DELETE FROM user_friends WHERE ((user_id=? and friend_id=?) OR (friend_id=? and user_id=?)) AND type='N'";
    // let data = {
    //    user_id:params.id,
    //    friend_id:params.friend_id
    // };
    // let data2 ={
    //     user_id:params.friend_id,
    //     friend_id:params.id
    // };
    let data = [params.id, params.friend_id, params.id, params.friend_id];
    database
      .delete(query, data)
      .then(result => {
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};
commonDao.get_workout_details = params => {
  return new Promise((resolve, reject) => {
    let query = `select T1.*,T2.title as category_title ,CONCAT(T3.first_name,' ',T3.last_name) as posted_user_name,
        T3.latitude as user_latitude,T3.longitude as user_longitude,T3.image as user_image
                 from workout_master T1 
                 left join category_master T2 on T2.id =  T1.category_id
                 left join user_master T3 on T3.user_id =  T1.user_id
                 where T1.id=?`;
    let workout_id = params.workout_id;
    let data = [workout_id];
    database
      .select(query, data)
      .then(result => {
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};
commonDao.showAllNotifications = params => {
  return new Promise((resolve, reject) => {
    let query = `SELECT T1.*
        ,concat(T2.first_name,' ',T2.last_name) as user_name
        ,T3.title as message
        FROM notification_master T1 
        LEFT JOIN  user_master T2 ON T1.performer_id=T2.user_id
        LEFT JOIN  notification_type T3 ON T1.notify_type=T3.id
        WHERE T1.user_id = ?
        ORDER BY T1.date_time DESC LIMIT ?,10`;
    console.log("Query ", query);
    let para = [params.user_id, params.page];
    database
      .select(query, para)
      .then(result => {
        if (Array.isArray(result) && result.length > 0) {
          resolve(result);
        } else {
          reject("No data found");
        }
      })
      .catch(function(err) {
        reject(err);
      });
  });
};
commonDao.updateNotification = params => {
  return new Promise((resolve, reject) => {
    // let query2= "update notification_master set read_status='Y' WHERE user_id=?";
    let con = {
      key: "user_id",
      value: params.user_id
    };
    database
      .updateSingle("notification_master", { read_status: "Y" }, con)
      .then(result => {
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};
commonDao.time_ago = params => {
  return new Promise((resolve, reject) => {
    var time_ago = new Date(params.time_ago).getTime();
    var cur_time = time();
    var time_elapsed = cur_time - time_ago;
    var seconds = time_elapsed;
    var minutes = round(time_elapsed / 60);
    var hours = round(time_elapsed / 3600);
    var days = round(time_elapsed / 86400);
    var weeks = round(time_elapsed / 604800);
    var months = round(time_elapsed / 2600640);
    var years = round(time_elapsed / 31207680);
    // Seconds
    if (seconds <= 60) {
      resolve("just now");
    }
    //Minutes
    else if (minutes <= 60) {
      if (minutes == 1) {
        return "1m";
      } else {
        return "$minutes minutes";
      }
    }
    //Hours
    else if (hours <= 24) {
      if (hours == 1) {
        return "1hr";
      } else {
        return "$hours hours";
      }
    }
    //Days
    else if (days <= 7) {
      if (days == 1) {
        return "yesterday";
      } else {
        return "$days days ago";
      }
    }
    //Weeks
    else if (weeks <= 4.3) {
      if (weeks == 1) {
        return "a week ago";
      } else {
        return "$weeks weeks ago";
      }
    }
    //Months
    else if (months <= 12) {
      if (months == 1) {
        return "a month ago";
      } else {
        return "$months months ago";
      }
    }
    //Years
    else {
      if (years == 1) {
        return "one year ago";
      } else {
        return "$years years ago";
      }
    }
  });
};
// });

commonDao.getAllcategories = params => {
  return new Promise((resolve, reject) => {
    let sql = `select T1.*
        from category_master T1 
        where T1.active = 'Y'`;
    // let active=params.active;
    // data=[active];
    database
      .select(sql, params)
      .then(result => {
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};
commonDao.delete_workout = params => {
  return new Promise((resolve, reject) => {
    let query = "delete from workout_joinees where workout_id = ?";
    let workout_id = params.workout_id;
    let data = [workout_id];
    database
      .delete(query, data)
      .then(result => {
        resolve(params);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};
commonDao.delete_workout3 = params => {
  return new Promise((resolve, reject) => {
    let query = "delete from workout_master where id = ?";
    let id = params.workout_id;
    let data = [id];
    console.log("query", query, data);
    database
      .delete(query, data)
      .then(result => {
        resolve(params);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};
commonDao.delete_workout2 = params => {
  return new Promise((resolve, reject) => {
    let query =
      "delete from notification_master where file_id = ? and notify_type <> '1'";
    let file_id = params.workout_id;
    let noti = params.notify_type;
    let data = [file_id, noti];
    database
      .delete(query, data)
      .then(result => {
        resolve(params);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

commonDao.check_joined_status = params => {
  return new Promise((resolve, reject) => {
    let para = params;
    let query = `SELECT * 
                    FROM workout_joinees 
                    WHERE user_id = ? 
                    AND workout_id = ? `;
    let data = [para.user_id, para.workout_id];

    database
      .delete(query, data)
      .then(result => {
        // console.log("result", result);
        // if(result.length > 0){
        //     reject("User already exist.");
        // }else{

        // }
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

commonDao.add_friend_request = params => {
  return new Promise((resolve, reject) => {
    let para = params;
    let data = {
      sender_id: para.user_id,
      reciever_id: para.friend_id,
      status: "N"
    };
    database
      .insert("friend_request", data)
      .then(result => {
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

commonDao.get_user_details = params => {
  return new Promise((resolve, reject) => {
    let query = `select T1.* from user_master T1
                    where T1.user_id = ?`;
    let data = [params.user_id];

    database
      .select(query, data)
      .then(result => {
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

commonDao.remove_friend_request = params => {
  return new Promise((resolve, reject) => {
    let query = `DELETE
                    FROM friend_request
                    WHERE ((
                                sender_id = ?
                                AND reciever_id = ?
                            )
                            OR
                            (
                                reciever_id = ?
                                AND sender_id = ?
                            )
                    )`;
    let data = [
      params.user_id,
      params.friend_id,
      params.user_id,
      params.friend_id
    ];

    database
      .delete(query, data)
      .then(result => {
        result.delete_status = true;
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

commonDao.check_friend_status = params => {
  return new Promise((resolve, reject) => {
    let para = params;
    let query = `SELECT * 
                    FROM friend_request 
                    WHERE sender_id = ? 
                    AND reciever_id = ? 
                    AND status = 'N'`;
    let data = [para.user_id, para.friend_id];

    database
      .delete(query, data)
      .then(result => {
        // console.log("result", result);
        // if(result.length > 0){
        //     reject("User already exist.");
        // }else{

        // }
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};
commonDao.get_details = params => {
  return new Promise((resolve, reject) => {
    let query = `SELECT WJ.id 
        ,WJ.workout_id
        ,WJ.user_id as joinedduser_id 
        ,WM.user_id as user_id 
        ,CONCAT(UM1.first_name,'',UM1.last_name) as joinedusername	
        ,UM2.device_token
        FROM workout_joinees WJ
        LEFT JOIN workout_master WM ON WM.id=WJ.workout_id 
        LEFT JOIN user_master UM1 ON UM1.user_id=WJ.user_id
        LEFT JOIN user_master UM2 ON UM2.user_id=WM.user_id  
        WHERE WJ.workout_id =? AND UM1.active='Y' AND UM1.user_id =?`;

    let data = [params.workout_id, params.user_id];

    database
      .delete(query, data)
      .then(result => {
        result.delete_status = true;
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};
commonDao.update_iphone_notification = params => {
  return new Promise((resolve, reject) => {
    let query = `SELECT user_id,iphone_noti_count FROM user_master WHERE user_id=?`;
    // console.log("Query ", query);
    let para = [params.user_id];
    database
      .select(query, para)
      .then(result => {
        if (Array.isArray(result) && result.length > 0) {
          resolve(result);
        } else {
          reject("No data found");
        }
        resolve(params);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};
commonDao.update_iphone_notification2 = params => {
  return new Promise((resolve, reject) => {
    let count = params.iphone_noti_count;
    let con = {
      key: "user_id",
      value: params.user_id
    };
    database
      .updateSingle("user_master", { iphone_noti_count: count }, con)
      .then(result => {
        resolve(params);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};
commonDao.join_workout = params => {
  return new Promise((resolve, reject) => {
    query = "select joined_member_count,user_id from workout_master where id=?";
    // console.log("Query ", query);
    let para = [params.workout_id];
    database
      .select(query, para)
      .then(result => {
        resolve(params);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

commonDao.join_workout2 = params => {
  return new Promise((resolve, reject) => {
    query = "select T1.* from user_friends T1 where T1.user_id=?";
    // console.log("Query ", query);
    let para = [params.user_id];
    database
      .select(query, para)
      .then(result => {
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

commonDao.unjoin_workout = params => {
  return new Promise((resolve, reject) => {
    let query = ` DELETE  from workout_joinees WHERE user_id='$user_id' AND workout_id=?`;
    let data = [params.workout_id];

    database
      .delete(query, data)
      .then(result => {
        result.delete_status = true;
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

commonDao.unjoin_workout2 = params => {
  return new Promise((resolve, reject) => {
    let query = ` delete from notification_master where file_id = ? and notify_type = '2' and performer_id=?`;
    let data = [params.workout_id, params.user_id];

    database
      .delete(query, data)
      .then(result => {
        result.delete_status = true;
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

commonDao.unjoin_workout3 = params => {
  return new Promise((resolve, reject) => {
    let query = ` select joined_member_count from workout_master where id=?`;
    let data = [params.workout_id];

    database
      .delete(query, data)
      .then(result => {
        result.delete_status = true;
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

commonDao.create_workout = params => {
  return new Promise((resolve, reject) => {
    let date_time = params.workout_date + " " + params.workout_time;
    var data = {
      user_id: params.user_id,
      title: params.title,
      description: params.description,
      category_id: params.category_id,
      image: params.image,
      location: params.location,
      latitude: params.latitude,
      longitude: params.longitude,
      date_time: moment().format("YYYY-MM-DD H:mm:ss"),
      workout_date: params.workout_date,
      workout_time: params.workout_time,
      workout_date_time: date_time,
      max_join_count: params.max_join_count,
      notification_send_status: ""
    };
    //  let query =
    database
      .insert("workout_master", data)
      .then(result => {
        result.delete_status = true;
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

commonDao.update_workout = params => {
  return new Promise((resolve, reject) => {
    let date_time = params.workout_date + " " + params.workout_time;
    var data = {
      user_id: params.user_id,
      title: params.title,
      description: params.description,
      category_id: params.category_id,
      image: params.image,
      location: params.location,
      latitude: params.latitude,
      longitude: params.longitude,
      date_time: moment().format("YYYY-MM-DD H:mm:ss"),
      workout_date: params.workout_date,
      workout_time: params.workout_time,
      workout_date_time: date_time,
      max_join_count: params.max_join_count,
      notification_send_status: "Y",
      joined_member_count: 0,
      active: "y"
    };

    console.log("Data", data);
    database
      .insert("workout_master", data)
      .then(result => {
        result.delete_status = true;
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

commonDao.group_workout1 = (params) => {
  return new Promise((resolve, reject) => {
      let query = 'SELECT member_id FROM message_group_members WHERE group_id = ?';
      let group_id=params.group_id
      let data = [group_id];
      database.select(query, data).then((result) => {
          if (Array.isArray(result) && result.length > 0) {
              resolve(result);
          } else {
              resolve([]);
          }
      }).catch(function (err) {
          reject(err);
      });
  });
}
module.exports = commonDao;
// group_workout