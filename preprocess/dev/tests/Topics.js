"use strict";

// self project modules
import assert from "assert";
import $sequelize from "../libs/sequelize";
import console from "gulp-util";

// Model Schema
const Topics = $sequelize.Topics;

/**
 * test case
 */

describe("Topics", (done)=>{

  describe("#count(All)", ()=>{
    it("should return 4 when count all", (done)=>{
      Topics.count({ where: {}})
      .then((number)=> {
        assert.equal(number, 4);
        done();
      })
      .catch((error)=>{
        console.log(error);
      });
    });
  });

  describe("#record(joke)", ()=>{
    let topic = {};
    before((done)=>{
      Topics.find({ 
        where: {
          topic: "joke"
        }
      })
      .then((d)=> {
        topic = d.dataValues;
        done()
      })
      .catch((error)=>{
        console.log(error);
      });
    });
    it("should return 1 when {retweeted_counts}", (done)=>{
      assert.equal(topic.retweeted_counts, 1);
      done();
    });
    it("should return 0 when {nonretweeted_counts }", (done)=>{
      assert.equal(topic.nonretweeted_counts , 0);
      done();
    });
  });

  describe("#record(在這裡輸入你想要說的話題)", ()=>{
    let topic = {};
    before((done)=>{
      Topics.find({ 
        where: {
          topic: "在這裡輸入你想要說的話題"
        }
      })
      .then((d)=> {
        topic = d.dataValues;
        done()
      })
      .catch((error)=>{
        console.log(error);
      });
    });
    it("should return 0 when {retweeted_counts}", (done)=>{
      assert.equal(topic.retweeted_counts, 0);
      done();
    });
    it("should return 2 when {nonretweeted_counts }", (done)=>{
      assert.equal(topic.nonretweeted_counts , 2);
      done();
    });
  });



});