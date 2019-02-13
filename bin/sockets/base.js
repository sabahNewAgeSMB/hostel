module.exports = function (io) {
	'use strict';
	var fs = require('fs');
	var functions = require('../../server/functions');
	var connections = [];
	var connectionProvider = require("../../server/dbConnectionProvider");
	var users = {};
	var moment=require('moment');
	let express = require('express')
	
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
// let io = socketIO(server);



}
