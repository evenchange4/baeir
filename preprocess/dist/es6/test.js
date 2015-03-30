"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

// node_modules

var lineByLine = _interopRequire(require("line-by-line"));

// self project

var $sequelize = _interopRequire(require("../libs/sequelize"));

var $configs = _interopRequire(require("../../configs.json"));

// Model Schema
var Tweets = $sequelize.Tweets;

var filePath = process.argv[2];
var lr = new lineByLine(filePath);

lr.on("line", function (line) {
  var _line$split = line.split(",");

  // console.log(permission_denied);

  var _line$split2 = _slicedToArray(_line$split, 11);

  var mid = _line$split2[0];
  var retweeted_status_mid = _line$split2[1];
  var uid = _line$split2[2];
  var retweeted_uid = _line$split2[3];
  var source = _line$split2[4];
  var image = _line$split2[5];
  var text = _line$split2[6];
  var geo = _line$split2[7];
  var created_at = _line$split2[8];
  var deleted_last_seen = _line$split2[9];
  var permission_denied = _line$split2[10];
});