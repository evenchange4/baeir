"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

// node_modules

var LineByLineReader = _interopRequire(require("line-by-line"));

var Promise = _interopRequire(require("bluebird"));

// self project

var $sequelize = _interopRequire(require("../libs/sequelize"));

// import $configs from "../../configs.json";

// Model Schema
var Tweets = $sequelize.Tweets;
var Users = $sequelize.Users;
var Users_Tweets = $sequelize.Users_Tweets;

var filePath = process.argv[2];
var lr = new LineByLineReader(filePath);

lr.on("line", function (line) {

  // 暫停，直到 lr.resume();
  lr.pause();

  var _line$split = line.split(",");

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

  Promise.resolve().then(function () {
    // Tweet count
    return Users.findOrCreate({ where: { uid: uid }, defaults: { tweet_counts: 1 } });
  }).then(function (d) {
    console.log(d[0].options.isNewRecord);
    console.log(d[0].dataValues);
    var tweet_counts = d[0].dataValues.tweet_counts + 1;
    if (!d[0].options.isNewRecord) {
      Users.update({ tweet_counts: tweet_counts }, { where: { uid: uid } }).then(function () {
        lr.resume();
      });
    }
  })
  // .then(()=>{
  //   // retweet count
  //   console.log(retweeted_uid);
  //   if(retweeted_uid != ""){
  //     return Users.findOrCreate({ where:{ uid: retweeted_uid }, defaults: { retweet_counts: 1 }  })
  //     .then((d)=>{
  //       console.log(d);
  //       var retweet_counts = d[0].dataValues.retweet_counts + 1;
  //       if(!d[0].options.isNewRecord){
  //         Users.update({ retweet_counts }, { where: { uid: retweeted_uid } });
  //       }
  //     })
  //   }
  // })
  .then(function (d) {
    console.log(d);
    console.log(1);
    lr.resume();
  })["catch"](function (error) {
    console.log(error);
  });

  // .success( (d) =>{
  //   console.log(d);
  //   console.log(d === null);
  //   if (d != null) {
  //     console.log("user exist");
  //   }
  //   else{
  //     Users.create({ uid })
  //     .success ((d) =>{
  //       // console.log(d);
  //     })
  //     .error((error) =>{
  //       // console.log(error);
  //     })
  //   }
  // })
  // .error((error) =>{
  //   console.log(error);
  // });

  // create tweet

  // Tweets.create({
  //   mid,
  //   retweeted_status_mid,
  //   uid,
  //   retweeted_uid,
  //   source,
  //   image,
  //   text,
  //   text_length,
  //   geo,
  //   created_at,
  //   deleted_last_seen,
  //   permission_denied
  // })
  // .success( ()=> {
  //   console.log(123);
  // })
  // .error( (d) => {
  //   console.log(d);   
  // });
});