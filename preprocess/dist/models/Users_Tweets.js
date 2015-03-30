"use strict";

module.exports = function (sequelize, Sequelize) {
  return sequelize.define("Users_Tweets", {
    user_tweet_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER
    },
    // uid - Pseudo user ID
    uid: {
      type: Sequelize.STRING
    },
    tweet_id: {
      type: Sequelize.INTEGER
    },
    // mid - Unique pseudo message ID
    mid: {
      type: Sequelize.STRING }
  });
};