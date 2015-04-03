module.exports = function(sequelize, Sequelize){
  return sequelize.define('Expressions', {
    expression: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    // Tweets Count: 出現在多少 non-retweet 數量
    tweet_counts: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    // retweets Count: 出現在多少 reTweet 數量
    retweet_counts: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
  });
};