module.exports = function(sequelize, Sequelize){
  return sequelize.define('Users', {
    user_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    // uid - Pseudo user ID
    uid: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    // Tweets Count:
    // Tweet 的數量越多同樣也是代表這個 User 在平台上的活躍程 度以及帳號時間長度。
    tweet_counts: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    retweet_counts: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    // Mention Count: 曾經提到別人的數量。
    mention_counts: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    // Mention Count: 曾經被提及的數量。
    mentioned_counts: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  });
};