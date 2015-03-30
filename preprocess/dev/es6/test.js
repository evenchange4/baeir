// node_modules
import lineByLine from "line-by-line";

// self project
import $sequelize from "../libs/sequelize";
import $configs from "../../configs.json";

// Model Schema
var Tweets = $sequelize.Tweets

var filePath = process.argv[2];
var lr = new lineByLine(filePath);

lr.on("line", (line) => {
  var [ mid, retweeted_status_mid, uid, retweeted_uid, source, image, text, geo, created_at, deleted_last_seen, permission_denied ] = line.split(",");
  // console.log(permission_denied);
});

