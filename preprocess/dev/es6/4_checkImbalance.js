"use strict";

// node_modules
import Promise from "bluebird";
import console from "gulp-util";
import CliTable from "cli-table";

// self project modules
import $sequelize from "../libs/sequelize";
import * as $sql from "../libs/sql";
import $params from "../../configs/parameters.json";

// Model Schema
const Expressions = $sequelize.Expressions;
const Topics = $sequelize.Topics;
const Relation_Users_Tweets = $sequelize.Relation_Users_Tweets;

/**
* Check imblanced Datasets
*
* @param  {Table} Tweets
*
* @return {int} Train_Negative
* @return {int} Train_Positive
*
* @author Michael Hsu
*/

// Reporter
// instantiate
let cliTable = new CliTable();
let countObj = {};

Promise.resolve()
.then(()=>{
  countObj.Limit = $params.lowerLimitOfTweetConuts;
  cliTable.push({
    Limit: $params.lowerLimitOfTweetConuts
  });
})
.then(()=>{
  return $sequelize.sequelize.query($sql.imbalance, null, { raw: true } );
})
.then((data)=>{
  countObj.Trains = {};
  countObj.Tests = {};
  data[0].forEach((d)=>{
    if(d.isTrain){
      if(d.isRetweeted){
        countObj.Trains.Positive = parseInt(d.count);
      }
      else{
        countObj.Trains.Negative = parseInt(d.count);
      }
    }
    else{
      if(d.isRetweeted){
        countObj.Tests.Positive = parseInt(d.count);
      }
      else{
        countObj.Tests.Negative = parseInt(d.count);
      }
    }
  });
})
.then(()=>{
  return $sequelize.sequelize.query($sql.testerCount, null, { raw: true } );
})
.then((data)=>{
  countObj.Testers = parseInt(data[0][0].count);
  cliTable.push({
    Testers: parseInt(data[0][0].count)
  });
})
.then(()=>{
  return Relation_Users_Tweets.count();
})
.then((data)=>{
  countObj.Tweets = data;
  cliTable.push({
    Tweets: data
  });
})
.then(()=>{
  return Expressions.count();
})
.then((data)=>{
  countObj.Expressions = data;
  cliTable.push({
    Expressions: data
  });
})
.then(()=>{
  return Topics.count();
})
.then((data)=>{
  countObj.Topics = data;
  cliTable.push({
    Topics: data
  });
})
.then(()=>{

  let cliTable2 = new CliTable({
    head: [
      countObj.Limit, 
      "Positive",
      "Negative",
      "Total",
      "%"
    ], 
    colWidths: [10, 10, 10, 10, 10]
  });

  cliTable2.push([
      "Trains",
      countObj.Trains.Positive,
      countObj.Trains.Negative,
      countObj.Trains.Positive + countObj.Trains.Negative,
      countObj.Trains.Positive/(countObj.Trains.Positive + countObj.Trains.Negative)
    ], [
      "Tests",
      countObj.Tests.Positive,
      countObj.Tests.Negative,
      countObj.Tests.Positive + countObj.Tests.Negative,
      countObj.Tests.Positive/(countObj.Tests.Positive + countObj.Tests.Negative)
    ]
  );


  console.log("\n" + cliTable.toString());
  console.log("\n" + cliTable2.toString());

})
.catch((error)=>{
  console.log(error);
});
