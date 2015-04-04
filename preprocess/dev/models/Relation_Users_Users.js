"use strict";

module.exports = function(sequelize, Sequelize){
  return sequelize.define('Relation_Users_Users', {
    // uid1
    uid1: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    // uid2
    uid2: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    uid1_mention_uid2:{
      type: Sequelize.INTEGER,
      defaultValue: 0
    },  
    uid2_mention_uid1:{
      type: Sequelize.INTEGER,
      defaultValue: 0
    },  
    uid1_retweet_uid2:{
      type: Sequelize.INTEGER,
      defaultValue: 0
    },  
    uid2_retweet_uid1:{
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  });
};