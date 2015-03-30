// node_modules
import LineByLineReader from "line-by-line";

// self project
import $sequelize from "../libs/sequelize";
import $configs from "../../configs.json";

// Model Schema
var Tweets = $sequelize.Tweets;
var Users = $sequelize.Users;
var Users_Tweets = $sequelize.Users_Tweets

var filePath = process.argv[2];
var lr = new LineByLineReader(filePath);

lr.on("line", (line) => {
  lr.pause();

  var [ mid, retweeted_status_mid, uid, retweeted_uid, source, image, text, geo, created_at, deleted_last_seen, permission_denied ] = line.split(",");
  console.log(mid);  

  // create user
  Users.findOrCreate({ where:{ uid } }, { tweet_counts: 1 })
  .then ((d) =>{
    var tweet_counts = d[0].dataValues.tweet_counts + 1;
    if(!d[0].options.isNewRecord){
      console.log(tweet_counts);

      return Users.update({ tweet_counts }, { where: { uid } });
    }
  })
  .then((d)=>{
    return lr.resume();
  })
  .catch((error)=>{
    console.log(error);
  });
  // .success( (d) =>{
  //   console.log(d);
  //   console.log(d === null);
  //   if (d != null) {
  //     console.log("user exist");
  //   }
  //   else{
  //     Users.create({ uid })
  //     .success ((d) =>{
  //       // console.log(d);
  //     })
  //     .error((error) =>{
  //       // console.log(error);
  //     })
  //   }
  // })
  // .error((error) =>{
  //   console.log(error);
  // });

  // create tweet

  // Tweets.create({
  //   mid,
  //   retweeted_status_mid,
  //   uid,
  //   retweeted_uid,
  //   source,
  //   image,
  //   text,
  //   text_length,
  //   geo,
  //   created_at,
  //   deleted_last_seen,
  //   permission_denied
  // })
  // .success( ()=> {
  //   console.log(123);
  // })
  // .error( (d) => {
  //   console.log(d);    
  // });  

});

