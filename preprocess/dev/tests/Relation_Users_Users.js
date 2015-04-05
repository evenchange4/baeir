"use strict";

// self project modules
import assert from "assert";
import $sequelize from "../libs/sequelize";
import console from "gulp-util";

// Model Schema
const Relation_Users_Users = $sequelize.Relation_Users_Users;

/**
 * test case
 */

describe("Relation_Users_Users", (done)=>{

  describe("#record(uxxxxxxx, uK3RXUYW3)", ()=>{
    let relation = {};
    before((done)=>{
      Relation_Users_Users.find({ 
        where: {
          uid1: "uxxxxxxx",
          uid2: "uK3RXUYW3"
        }
      })
      .then((d)=> {
        relation = d.dataValues;
        done();
      });
    });
    it("should return 1 when {uid1_mention_uid2}", (done)=>{
      assert.equal(relation.uid1_mention_uid2, 1);
      done();
    });
    it("should return 0 when {uid2_mention_uid1}", (done)=>{
      assert.equal(relation.uid2_mention_uid1, 0);
      done();
    });
    it("should return 0 when {uid1_retweet_uid2}", (done)=>{
      assert.equal(relation.uid1_retweet_uid2, 0);
      done();
    });
    it("should return 0 when {uid2_retweet_uid1}", (done)=>{
      assert.equal(relation.uid2_retweet_uid1, 0);
      done();
    });
  });

  describe("#record(uzzzzzzz, uxxxxxxx)", ()=>{
    let relation = {};
    before((done)=>{
      Relation_Users_Users.find({ 
        where: {
          uid1: "uzzzzzzz",
          uid2: "uxxxxxxx"
        }
      })
      .then((d)=> {
        relation = d.dataValues;
        done();
      });
    });
    it("should return 2 when {uid1_mention_uid2}", (done)=>{
      assert.equal(relation.uid1_mention_uid2, 2);
      done();
    });
    it("should return 0 when {uid2_mention_uid1}", (done)=>{
      assert.equal(relation.uid2_mention_uid1, 0);
      done();
    });
    it("should return 2 when {uid1_retweet_uid2}", (done)=>{
      assert.equal(relation.uid1_retweet_uid2, 2);
      done();
    });
    it("should return 1 when {uid2_retweet_uid1}", (done)=>{
      assert.equal(relation.uid2_retweet_uid1, 1);
      done();
    });
  });

});