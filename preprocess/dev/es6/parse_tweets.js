"use strict";

// node_modules
import LineByLineReader from "line-by-line";
import Promise from "bluebird";
import lineReader from "line-reader";

// self project
import $sequelize from "../libs/sequelize";
// import $configs from "../../configs.json";

// Model Schema
var Tweets = $sequelize.Tweets;
var Users = $sequelize.Users;
var Users_Tweets = $sequelize.Users_Tweets

var filePath = process.argv[2];
// var lr = new LineByLineReader(filePath, {skipEmptyLines: true });

// read all lines:
lineReader.eachLine(filePath, function(line, last) {
  var [ mid, retweeted_status_mid, uid, retweeted_uid, source, image, text, geo, created_at, deleted_last_seen, permission_denied ] = line.split(",");

  Promise.resolve()
  .then(()=>{
    // Tweet count
    return Users.findOrCreate({ where:{ uid }, defaults: { tweet_counts: 1 }  });
  })
  // .then((d)=>{
  //   var tweet_counts = d[0].dataValues.tweet_counts + 1;
  //   if(!d[0].options.isNewRecord){
  //     return Users.update({ tweet_counts }, { where: { uid } });
  //   }
  // })
  .catch((error)=>{
    console.log(error);
  });

  // console.log(last);  

  // if (/* done */) {
  //   return false; // stop reading
  // }
});

// lr.on("line", (line) => {

//   // 暫停，直到 lr.resume();
//   lr.pause();
//   var [ mid, retweeted_status_mid, uid, retweeted_uid, source, image, text, geo, created_at, deleted_last_seen, permission_denied ] = line.split(",");

//   setTimeout(()=>{
//     console.log(mid);
//     // lr.pause();
//     setTimeout(()=>{
//       console.log(2);
//       lr.resume();
//     }, 1000);
//   }, 1000);

  // var [ mid, retweeted_status_mid, uid, retweeted_uid, source, image, text, geo, created_at, deleted_last_seen, permission_denied ] = line.split(",");

  // Users.find({ where:{ uid } })
  // .then((d)=>{
  //   if(d === null){
  //     return Users.create({ uid });
  //   }
  // })
  // .then(()=>{
  //   return Users.find({ where:{ uid } });
  // })
  // .then((d)=>{
  //   var tweet_counts = d.dataValues.tweet_counts + 1;
  //   var user_id = d.dataValues.user_id;
  //   console.log({user_id, uid, tweet_counts});
  //   Users.update({ tweet_counts }, { where: { uid } })
  //   .success((d)=>{
  //     console.log(d);
  //     setTimeout(()=>{
  //       lr.resume();
  //     }, 1000);
      
  //   });
  //   // if(!d.isNewRecord){
  //   //   return Users.update({ tweet_counts }, { where: { uid } });
  //   // }
  // })  
  // .then(()=>{
  //   lr.resume();
  // });


  
  // Users.findOrCreate({ where:{ uid }, defaults: { tweet_counts: 1 }  })
  // .then((d)=>{
  //   console.log(d);
  //   // lr.resume();
  //   var tweet_counts = d[0].dataValues.tweet_counts + 1;
  //   if(!d[0].options.isNewRecord){
  //     return Users.update({ tweet_counts }, { where: { uid } });
  //   }
  // })  
  // .then(()=>{
  //   // retweet count
  //   console.log(retweeted_uid);
  //   if(retweeted_uid != ""){
  //     return Users.findOrCreate({ where:{ uid: retweeted_uid }, defaults: { retweet_counts: 1 }  })
  //     .then((d)=>{
  //       console.log(d);
  //       var retweet_counts = d[0].dataValues.retweet_counts + 1;
  //       if(!d[0].options.isNewRecord){
  //         Users.update({ retweet_counts }, { where: { uid: retweeted_uid } });
  //       }
  //     })
  //   }
  // })
  // .then((d)=>{
  //   console.log(d);
  //   lr.resume();
  // })
  // .catch((error)=>{
  //   console.log(error);
  // });



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

// });

