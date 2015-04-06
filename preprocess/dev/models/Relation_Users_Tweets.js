"use strict";

module.exports = function(sequelize, Sequelize){
  return sequelize.define('Relation_Users_Tweets', {
    // uid - Pseudo user ID
    uid: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    // mid - Unique pseudo message ID
    mid: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    // ####################################
    // Output: 是否被轉錄 
    // #################################### 
    isTrain: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });
};