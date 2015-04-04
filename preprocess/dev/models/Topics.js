"use strict";

module.exports = function(sequelize, Sequelize){
  return sequelize.define('Topics', {
    topic: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    // 出現，且被 retweet 的數量
    retweeted_counts: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    // 出現，但沒被 retweet 的數量
    nonretweeted_counts: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  });
};