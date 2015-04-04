module.exports = function(sequelize, Sequelize){
  return sequelize.define('Users', {
    // uid - Pseudo user ID
    uid: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    // Tweet 的數量越多同樣也是代表這個 User 在平台上的活躍程 度以及帳號時間長度。
    tweet_counts: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    // 屬於轉錄別人的文章
    retweet_counts: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    // 被轉錄數量
    retweeted_counts: {
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
    },
    // 可能是  點評 或 音樂
    url_counts:{
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    // 表情 ex: [崩潰]
    expression_counts:{
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    // 話題 ex: #終極一班#
    topic_counts:{
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    // 話題 ex: #終極一班#
    geo_counts:{
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  });
};