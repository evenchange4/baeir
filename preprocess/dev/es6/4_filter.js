"use strict";

// node_modules
import Promise from "bluebird";
require("babel/register");
// import console from "gulp-util";

// self project modules
import $sequelize from "../libs/sequelize";
import * as $sql from "../libs/sql";

// Model Schema
const Users = $sequelize.Users;

/**
* 1. 篩選 受試者 列表
*
* @author Michael Hsu
*/

Promise.resolve()
.then(()=>{
  // 1. 找出所有 Users 以及 Tweets
  return $sequelize.sequelize.query($sql.filter, null, { raw: true } );
})
.then((data)=>{
  let trainsList = data[0];
  let testsList = [];

  console.log(data[0].length);
  console.log(data[1].rowCount);

  let start = Number.parseInt(data[1].rowCount * 4 / 5);
  let end = data[1].rowCount;

  for (let i = start; i <= end; i++) {
    testsList.push(trainsList.pop());
  }

  console.log(trainsList.length);
  console.log(testsList.length);

  return {trainsList, testsList};
})
.then((data)=>{
  console.log(data);
})
.catch((error)=>{
  console.log(error);
});

// let lowerLimitList = [10, 15, 20, 25, 30, 35];
// let chooseLimit = 30;

// Promise.resolve(lowerLimitList)
// .map((limit)=>{
//   return Users.findAll({
//     where: {
//       uid: {
//         $like: "u%"
//       },
//       tweet_counts: {
//         $gte: limit
//       }
//     }
//   });
// })
// .each((users, index)=>{
//   console.log(`tweet_counts >= ${lowerLimitList[index]}: ${users.length}`);
//   if (users.length < 1000){
//     chooseLimit =lowerLimitList[index-1];
//   }
// })
// .then(()=>{
//   console.log(`>> final choose = ${chooseLimit}`);
//   return Users.findAll({
//     where: {
//       uid: {
//         $like: "u%"
//       },
//       tweet_counts: {
//         $gte: chooseLimit
//       }
//     }
//   });
// })
// .each((users)=>{
//   console.log(users.uid);
// })
// .catch((error)=>{
//   console.log(error);
// });