"use strict";

// self project modules
import assert from "assert";
import $sequelize from "../libs/sequelize";
import console from "gulp-util";

// Model Schema
const Users = $sequelize.Users;

/**
 * test case
 */

describe("Users", (done)=>{

  describe("#count(All)", ()=>{
    it("should return 10 when count all", (done)=>{
      Users.count({ where: {}})
      .then((number)=> {
        assert.equal(number, 10);
        done();
      });
    });
  });

  describe("#record(uxxxxxxx)", ()=>{
    let user = {};
    before((done)=>{
      Users.find({ 
        where: {
          uid: "uxxxxxxx"
        }
      })
      .then((d)=> {
        user = d.dataValues;
        done()
      });
    });
    it("should return 1 when {tweet_counts}", (done)=>{
      assert.equal(user.tweet_counts, 1);
      done();
    });
    it("should return 2 when {retweet_counts}", (done)=>{
      assert.equal(user.retweet_counts, 2);
      done();
    });
    it("should return 2 when {retweeted_counts}", (done)=>{
      assert.equal(user.retweeted_counts, 2);
      done();
    });
    it("should return 2 when {mention_counts}", (done)=>{
      assert.equal(user.mention_counts, 2);
      done();
    });
    it("should return 2 when {mentioned_counts}", (done)=>{
      assert.equal(user.mentioned_counts, 2);
      done();
    });
    it("should return 1 when {url_counts}", (done)=>{
      assert.equal(user.url_counts, 1);
      done();
    });
    it("should return 1 when {expression_counts}", (done)=>{
      assert.equal(user.expression_counts, 1);
      done();
    });
    it("should return 2 when {topic_counts}", (done)=>{
      assert.equal(user.topic_counts, 2);
      done();
    });
    it("should return 1 when {geo_counts}", (done)=>{
      assert.equal(user.geo_counts, 1);
      done();
    });
  });

  describe("#record(uyyyyyyyy)", ()=>{
    let user = {};
    before((done)=>{
      Users.find({ 
        where: {
          uid: "uyyyyyyyy"
        }
      })
      .then((d)=> {
        user = d.dataValues;
        done()
      });
    });
    it("should return 0 when {tweet_counts}", (done)=>{
      assert.equal(user.tweet_counts, 0);
      done();
    });
    it("should return 1 when {retweet_counts}", (done)=>{
      assert.equal(user.retweet_counts, 1);
      done();
    });
    it("should return 2 when {retweeted_counts}", (done)=>{
      assert.equal(user.retweeted_counts, 0);
      done();
    });
    it("should return 2 when {mention_counts}", (done)=>{
      assert.equal(user.mention_counts, 2);
      done();
    });
    it("should return 1 when {mentioned_counts}", (done)=>{
      assert.equal(user.mentioned_counts, 1);
      done();
    });
    it("should return 0 when {url_counts}", (done)=>{
      assert.equal(user.url_counts, 0);
      done();
    });
    it("should return 0 when {expression_counts}", (done)=>{
      assert.equal(user.expression_counts, 0);
      done();
    });
    it("should return 0 when {topic_counts}", (done)=>{
      assert.equal(user.topic_counts, 0);
      done();
    });
    it("should return 0 when {geo_counts}", (done)=>{
      assert.equal(user.geo_counts, 0);
      done();
    });
  });

  describe("#record(uzzzzzzz)", ()=>{
    let user = {};
    before((done)=>{
      Users.find({ 
        where: {
          uid: "uzzzzzzz"
        }
      })
      .then((d)=> {
        user = d.dataValues;
        done()
      });
    });
    it("should return 0 when {tweet_counts}", (done)=>{
      assert.equal(user.tweet_counts, 0);
      done();
    });
    it("should return 2 when {retweet_counts}", (done)=>{
      assert.equal(user.retweet_counts, 2);
      done();
    });
    it("should return 1 when {retweeted_counts}", (done)=>{
      assert.equal(user.retweeted_counts, 1);
      done();
    });
    it("should return 9 when {mention_counts}", (done)=>{
      assert.equal(user.mention_counts, 9);
      done();
    });
    it("should return 1 when {mentioned_counts}", (done)=>{
      assert.equal(user.mentioned_counts, 1);
      done();
    });
    it("should return 0 when {url_counts}", (done)=>{
      assert.equal(user.url_counts, 0);
      done();
    });
    it("should return 2 when {expression_counts}", (done)=>{
      assert.equal(user.expression_counts, 2);
      done();
    });
    it("should return 0 when {topic_counts}", (done)=>{
      assert.equal(user.topic_counts, 0);
      done();
    });
    it("should return 1 when {geo_counts}", (done)=>{
      assert.equal(user.geo_counts, 1);
      done();
    });
  });


});