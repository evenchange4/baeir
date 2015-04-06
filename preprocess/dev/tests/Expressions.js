"use strict";

// self project modules
import assert from "assert";
import $sequelize from "../libs/sequelize";
import console from "gulp-util";

// Model Schema
const Expressions = $sequelize.Expressions;

/**
 * test case
 */

describe("Expressions", (done)=>{

  describe("#count(All)", ()=>{
    it("should return 10 when count all", (done)=>{
      Expressions.count({ where: {}})
      .then((number)=> {
        assert.equal(number, 10);
        done();
      })
      .catch((error)=>{
        console.log(error);
      });
    });
  });

  describe("#record(江南style)", ()=>{
    let expression = {};
    before((done)=>{
      Expressions.find({ 
        where: {
          expression: "江南style"
        }
      })
      .then((d)=> {
        expression = d.dataValues;
        done()
      })
      .catch((error)=>{
        console.log(error);
      });
    });
    it("should return 0 when {retweeted_counts}", (done)=>{
      assert.equal(expression.retweeted_counts, 0);
      done();
    });
    it("should return 2 when {nonretweeted_counts }", (done)=>{
      assert.equal(expression.nonretweeted_counts , 2);
      done();
    });
  });

  describe("#record(偷笑)", ()=>{
    let expression = {};
    before((done)=>{
      Expressions.find({ 
        where: {
          expression: "偷笑"
        }
      })
      .then((d)=> {
        expression = d.dataValues;
        done()
      })
      .catch((error)=>{
        console.log(error);
      });
    });
    it("should return 1 when {retweeted_counts}", (done)=>{
      assert.equal(expression.retweeted_counts, 1);
      done();
    });
    it("should return 0 when {nonretweeted_counts }", (done)=>{
      assert.equal(expression.nonretweeted_counts , 0);
      done();
    });
  });



});