var mysql = require("mysql");
var config = require("../config/config");

module.exports = function(config) {
  var connect = function() {
    return new Promise(function(resolve, reject) {
      let con = mysql.createConnection(config);
      con.connect(function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(con);
        }
      });
    });
  };

  var close = function(con) {
    return new Promise(function(resolve, reject) {
      con.end(function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(err);
        }
      });
    });
  };

  return {
    insert: function(table, data) {
      return new Promise(function(resolve, reject) {
        connect().then(function(con) {
          let query = "INSERT INTO ?? SET ?";
          let params = [table, data];
          con.query(query, params, function(err, result) {
            close(con);
            if (err) {
              reject(err);
            } else {
              resolve(result.insertId);
            }
          });
        });
      });
    },

    insertMultiple: function(table, keys, values) {
      return new Promise((resolve, reject) => {
        connect()
          .then(function(con) {
            let query = "INSERT INTO ?? " + keys + " VALUES ?";
            let params = [table, values];
            con.query(query, params, function(err, result) {
              if (err) {
                console.log("err", err);
                close(con);
                reject(con);
              } else {
                close(con);
                resolve(result.insertId);
              }
            });
          })
          .catch(function(con) {
            reject(err);
          });
      });
    },
    updateSingle: function(table, data, cond) {
      return new Promise(function(resolve, reject) {
        connect()
          .then(function(con) {
            let query = "UPDATE ?? SET ? WHERE ?? = ?";
            let params = [table, data, cond.key, cond.value];
            con.query(query, params, function(err, result) {
              if (err) {
                close(con);
                reject(err);
              } else {
                close(con);
                resolve(result);
              }
            });
          })
          .catch(function(err) {
            reject(err);
          });
      });
    },
    updateMultiple: function(table, data, cond) {
      return new Promise(function(resolve, reject) {
        connect()
          .then(function(con) {
            let query = "UPDATE ?? SET ? WHERE 1 = 1";
            let params = [table, data];
            if (Array.isArray(cond) && cond.length > 0) {
              for (let sing of cond) {
                query += " AND ?? = ?";
                params.push(sing.key, sing.value);
              }
            } else {
              query += " AND ?? = ?";
              params.push(cond.key, cond.value);
            }
            //console.log('params',params);
            con.query(query, params, function(err, result) {
              if (err) {
                close(con);
                reject(err);
              } else {
                close(con);
                resolve(result);
              }
            });
          })
          .catch(function(err) {
            reject(err);
          });
      });
    },
    select: function(query, params) {
      return new Promise(function(resolve, reject) {
        connect()
          .then(function(con) {
            con.query(query, params, function(err, result) {
              if (err) {
                close(con);
                resolve(err);
              } else {
                close(con);
                resolve(result);
              }
            });
          })
          .catch(function(err) {
            console.log("err", err);
            reject(err);
          });
      });
    },
    // delete: function (query, params) {
    //     return new Promise(function (resolve, reject) {
    //         connect()
    //             .then(function (con) {
    //                 con.query(query, params, function (err, result) {
    //                     if (err) {
    //                         close(con);
    //                         resolve(err);
    //                     } else {
    //                         close(con);
    //                         resolve(result);
    //                     }
    //                 });
    //             })
    //             .catch(function (err) {
    //                 console.log('err', err);
    //                 reject(err);
    //             });

    //     });
    //     }
    delete: function(query, params) {
      return new Promise(function(resolve, reject) {
        connect()
          .then(function(con) {
            con.query(query, params, function(err, result) {
              if (err) {
                close(con);
                resolve(err);
              } else {
                close(con);
                resolve(result);
              }
            });
          })
          .catch(function(err) {
            console.log("err", err);
            reject(err);
          });
      });
    }
  };
};
