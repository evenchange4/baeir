module.exports = function(sequelize, Sequelize){
  return sequelize.define('Tweets', {
    tweet_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true
    },
    // mid - Unique pseudo message ID
    mid: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    // retweeted_status_mid - original message
    // Only available if the row of interest is a retweet
    retweeted_status_mid: {
      type: Sequelize.STRING
    },
    // retweeted_uid - original poster
    // Only available if the row of interest is a retweet
    retweeted_uid: {
      type: Sequelize.STRING
    },
    // client program
    source: {
      type: Sequelize.STRING
    },
    // image - With image? (1= Yes, 0=No)
    image: {
      type: Sequelize.BOOLEAN
    },
    // text - body of the message.
    // (@xxxx:) is replaced by either the pseudo user ID or ukn (uknown)
    text: {
      type: Sequelize.TEXT
    },
    text_length:{
      type: Sequelize.INTEGER
    },
    // (@xxxx:) is replaced by either the pseudo user ID or ukn (uknown)
    mention_counts:{
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    url_counts:{
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    retweet_counts:{
      type: Sequelize.INTEGER,
      defaultValue: 0
    },    
    // GIS
    geo: {
      type: Sequelize.TEXT
    },
    // created_at - Original posting time
    created_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    // deleted_last_seen - The last seen time before this message was missing from the user timeline
    deleted_last_seen: {
      type: Sequelize.DATE,
      allowNull: true
    },
    //  message was found missing in the timeline and the API return message was 'permission denied'
    permission_denied: {
      type: Sequelize.TEXT
    }
  });
};