module.exports = function(sequelize, Sequelize){
  return sequelize.define('Relation_Mention', {
    // uid - Pseudo user ID
    uid: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    // mention_uid
    mention_uid: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    mention_counts:{
      type: Sequelize.INTEGER,
      defaultValue: 0
    },  
  });
};