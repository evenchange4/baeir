"use strict";

// self project modules
import assert from "assert";
import $sequelize from "../libs/sequelize";
import console from "gulp-util";

// Model Schema
const Tweets_Trains = $sequelize.Tweets_Trains;

/**
 * test case
 */

describe("Tweets_Trains", (done)=>{

  describe("#count(All)", ()=>{

    it("should return 8 when count all", (done)=>{
      Tweets_Trains.count({ where: {}})
      .then((number)=> {
        assert.equal(number, 8);
        done();
      });
    });
    
    it("should return 6 when count {isRetweeted: false}", (done)=>{
      Tweets_Trains.count({ where: { isRetweeted: false } })
      .then((number)=> {
        assert.equal(number, 6);
        done();
      });
    });
  
    it("should return 2 when count {isRetweeted: true}", (done)=>{
      Tweets_Trains.count({ where: { isRetweeted: true } })
      .then((number)=> {
        assert.equal(number, 2);
        done();
      });
    });

  });

  describe("#record(mRsOcOLTlc)", ()=>{
    let tweet = {};
    before((done)=>{
      Tweets_Trains.find({ 
        where: {
          mid: "mRsOcOLTlc"
        }
      })
      .then((d)=> {
        tweet = d.dataValues;
        done()
      });
    });
    it("should return true when {isRetweeted}", (done)=>{
      assert.equal(tweet.isRetweeted, true);
      done();
    });
    it("should return 2 when {retweeted_counts}", (done)=>{
      assert.equal(tweet.retweeted_counts, 2);
      done();
    });
    it("should return true when {isOriginal}", (done)=>{
      assert.equal(tweet.isOriginal, true);
      done();
    });
    it("should return 2 when {mention_counts}", (done)=>{
      assert.equal(tweet.mention_counts, 2);
      done();
    });
    it("should return 0 when {url_counts}", (done)=>{
      assert.equal(tweet.url_counts, 0);
      done();
    });
    it("should return 0 when {expression_counts}", (done)=>{
      assert.equal(tweet.expression_counts, 0);
      done();
    });
    it("should return 0 when {topic_counts}", (done)=>{
      assert.equal(tweet.topic_counts, 0);
      done();
    });
    it("should return false when {isgeo}", (done)=>{
      assert.equal(tweet.isgeo, false);
      done();
    });
  });

  describe("#record(mH44qG6iUm)", ()=>{
    let tweet = {};
    before((done)=>{
      Tweets_Trains.find({ 
        where: {
          mid: "mH44qG6iUm"
        }
      })
      .then((d)=> {
        tweet = d.dataValues;
        done()
      });
    });
    it("should return true when {isRetweeted}", (done)=>{
      assert.equal(tweet.isRetweeted, true);
      done();
    });
    it("should return 1 when {retweeted_counts}", (done)=>{
      assert.equal(tweet.retweeted_counts, 1);
      done();
    });
    it("should return true when {isOriginal}", (done)=>{
      assert.equal(tweet.isOriginal, true);
      done();
    });
    it("should return 0 when {mention_counts}", (done)=>{
      assert.equal(tweet.mention_counts, 0);
      done();
    });
    it("should return 1 when {url_counts}", (done)=>{
      assert.equal(tweet.url_counts, 1);
      done();
    });
    it("should return 1 when {expression_counts}", (done)=>{
      assert.equal(tweet.expression_counts, 1);
      done();
    });
    it("should return 1 when {topic_counts}", (done)=>{
      assert.equal(tweet.topic_counts, 1);
      done();
    });
    it("should return false when {isgeo}", (done)=>{
      assert.equal(tweet.isgeo, false);
      done();
    });
  });

});