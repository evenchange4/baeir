"use strict";

// self project modules
import assert from "assert";
import $sequelize from "../libs/sequelize";
import console from "gulp-util";

// Model Schema
const Relation_Users_Tweets = $sequelize.Relation_Users_Tweets;

/**
 * test case
 */

describe("Relation_Users_Tweets", (done)=>{

  describe("#count(All)", ()=>{

    it("should return 8 when count all", (done)=>{
      Relation_Users_Tweets.count({ where: {}})
      .then((number)=> {
        assert.equal(number, 8);
        done();
      })
      .catch((error)=>{
        console.log(error);
      });
    });
  });

});