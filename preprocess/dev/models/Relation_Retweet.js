module.exports = function(sequelize, Sequelize){
  return sequelize.define('Relation_Retweet', {
    // uid - Pseudo user ID
    uid: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    // retweeted_uid - original poster
    retweeted_uid: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    retweeted_counts:{
      type: Sequelize.INTEGER,
      defaultValue: 0
    },  
  });
};