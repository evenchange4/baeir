"use strict";

var fs, path, gulpUtil, async, Q, Sequelize, $config, db, sequelize, sync;
fs = require("fs");
path = require("path");
gulpUtil = require("gulp-util");
async = require("async");
Q = require("q");
Sequelize = require("sequelize");
$config = require("../../configs.json");
db = {};
sequelize = new Sequelize($config.database, $config.username, $config.password, {
  host: $config.host,
  dialect: $config.dialect,
  port: $config.port,
  logging: $config.logging,
  // max concurrent database requests; default: 50
  maxConcurrentQueries: $config.maxConcurrentQueries
});
fs.readdirSync(__dirname + "/../models").forEach(function (e) {
  var model;
  model = sequelize["import"](path.join(__dirname + "/../models", e));
  db[model.name] = model;
});
Object.keys(db).forEach(function (modelName) {
  if (in$("associate", db[modelName])) {
    db[modelName].associate(db);
  }
});
function mapSyncFn(model, callback) {
  db[model].sync({
    force: $config.force
  }).success(function () {
    callback();
  }).error(function () {
    callback("[Error] Model-" + model + " sync Fail");
  });
}
sync = function (modelNames) {
  var deferred;
  deferred = Q.defer();
  async.each(modelNames, mapSyncFn, function (error) {
    if (error) {
      gulpUtil.log(error);
    } else {
      deferred.resolve("[SYNC] Models sync Success");
    }
  });
  return deferred.promise;
};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.sync = sync;
module.exports = db;
function in$(x, xs) {
  var i = -1,
      l = xs.length >>> 0;
  while (++i < l) if (x === xs[i]) {
    return true;
  }return false;
}