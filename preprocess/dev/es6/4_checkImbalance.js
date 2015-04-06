"use strict";

// node_modules
import Promise from "bluebird";
import console from "gulp-util";

// self project modules
import $sequelize from "../libs/sequelize";
import * as $sql from "../libs/sql";

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

Promise.resolve()
.then(()=>{
  // 2. aggregate By Users，找出所有受訪者的 Tweets
  return $sequelize.sequelize.query($sql.imbalance, null, { raw: true } );
})
.then((data)=>{
  data[0].forEach((d)=>{
    if(d.isTrain){
      if(d.isRetweeted){
        console.log(`>> Trains, Positive = ${d.count}`);
      }
      else{
        console.log(`>> Trains, Negative = ${d.count}`);
      }
    }
    else{
      if(d.isRetweeted){
        console.log(`>> Tests, Positive = ${d.count}`);
      }
      else{
        console.log(`>> Tests, Negative = ${d.count}`);
      }
    }
  });
})

.catch((error)=>{
  console.log(error);
});
