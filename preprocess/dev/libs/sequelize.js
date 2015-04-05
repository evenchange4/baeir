"use strict";

// self project modules
import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import Promise from "bluebird";

// self project modules
import $config from "../../configs.json";

/**
* 連接資料庫
* Database setting
*
* @author Michael Hsu
*/

let db = {};
let sequelize = new Sequelize(
  $config.database, 
  $config.username, 
  $config.password, {
    host: $config.host,
    dialect: $config.dialect,
    port: $config.port,
    logging: $config.logging,
    // max concurrent database requests; default: 50
    maxConcurrentQueries: $config.maxConcurrentQueries
});

/**
* load Models
* associate
*
* @author Michael Hsu
*/

fs
.readdirSync(`${__dirname}/../models`)
.forEach((e)=>{
  let model = sequelize.import(path.join(`${__dirname}/../models`, e));
  db[model.name] = model;
});
Object
.keys(db)
.forEach((modelName)=>{
  if (in$("associate", db[modelName])) {
    db[modelName].associate(db);
  }
});

/**
* sync function
*
* @author Michael Hsu
*/

let sync = (modelNames) =>{
  return new Promise((resolve, reject) => {
    Promise.resolve(modelNames)
    .map((modelName)=>{
      return db[modelName].sync({ force: $config.force });
    })
    .then(()=>{
      resolve(">> [SYNC] Models sync Success");
    })
    .catch((error)=>{
      reject(error);
    });
  });
};

/**
* module.exports
*
* @author Michael Hsu
*/

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.sync = sync;
module.exports = db;

function in$(x, xs){
  var i = -1, l = xs.length >>> 0;
  while (++i < l) if (x === xs[i]) return true;
  return false;
}