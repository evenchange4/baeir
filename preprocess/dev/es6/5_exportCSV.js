import Promise from 'bluebird';
import console from 'gulp-util';
import Path from 'path';
import mkdirp from 'mkdirp';
import moment from 'moment';
let fs = Promise.promisifyAll(require('fs'));

// self project modules
import $sequelize from '../libs/sequelize';
import * as $sql from '../libs/sql';
import * as $format from '../libs/format';
import $params from '../../configs/parameters.json';
import $relationExtract from '../libs/relationExtract';

// variable
const user_has_relations_count_limit = $params.user_has_relations_count_limit;
const tweet_has_relations_count_limit = $params.tweet_has_relations_count_limit;
const timestamp = moment().format('YYYYMMDD_HHmmss');
const path = Path.join(__dirname, `/../../../output/${timestamp}/preprocess`);

let usersMap = new Map();
let tweetsMap = new Map();

// let tweetsBiasMap = new Map();

let userList = [];
let tweetList = [];
let relationList = [];

// let t_retweeted_counts_total = 0;

Promise.resolve()
.then(()=> {
  return mkdirp(path);
})

.then(()=> {
  return $sequelize.sequelize.query($sql.Relation_Users_Retweets, null, { raw: true });
})

.then((data)=> {
  let relations = data[0];
  return relations;
})

.then((relations)=> {
  let a = $relationExtract(relations, user_has_relations_count_limit, tweet_has_relations_count_limit);

  usersMap = a.usersMap;
  tweetsMap = a.tweetsMap;

  relationList = relations;

})

/**
* Output user list
*
* @author Michael Hsu
*/

.then(()=> {
  let output = '';

  usersMap.forEach((value, uid)=> {
    userList.push(uid);
    output = `${output}${uid}\n`;
  });

  // return fs.writeFile(`${path}/users.txt`, output);
})

/**
* Output tweet list
*
* @author Michael Hsu
*/

.then(()=> {
  // console.log(`>> Output file to ${path}/users.txt`);

  let output = '';

  tweetsMap.forEach((value, mid)=> {
    tweetList.push(mid);
    output = `${output}${mid}\n`;
  });

  // return fs.writeFile(`${path}/tweets.txt`, output);
})

// .each((relation)=> {

//   // tweetsBiasMap.set(
//   //   relation.retweeted_status_mid,
//   //   relation
//   // );
//   // t_retweeted_counts_total = t_retweeted_counts_total + relation.t_retweeted_counts;
//   return relation;
// })
.then(()=> {
  relationList.forEach((relation)=> {
    if ((userList.indexOf(relation.uid) > -1) && (tweetList.indexOf(relation.retweeted_status_mid) > -1)) {
      usersMap.get(relation.uid).set(
        relation.retweeted_status_mid,
        usersMap.get(relation.uid).get(relation.retweeted_status_mid) * (1 + Math.log(86400 / $format.toSec(relation.avg_response_time)))
        // usersMap.get(relation.uid).get(relation.retweeted_status_mid)
      );
    }
  });
})

/**
* Output report readme
*
* @author Michael Hsu
*/

.then(()=> {
  let totalReport = '';

  console.log(`>> # user_has_relations_count_limit = ${user_has_relations_count_limit}`);
  console.log(`>> # tweet_has_relations_count_limit = ${tweet_has_relations_count_limit}`);

  console.log(`>> # Users = ${userList.length}`);
  console.log(`>> # Tweets = ${tweetList.length}`);

  totalReport = `${totalReport} >> # user_has_relations_count_limit = ${user_has_relations_count_limit} \n`;
  totalReport = `${totalReport} >> # tweet_has_relations_count_limit = ${tweet_has_relations_count_limit} \n`;
  totalReport = `${totalReport} >> # Users = ${userList.length} \n`;
  totalReport = `${totalReport} >> # Tweets = ${tweetList.length} \n`;

  fs.writeFile(`${path}/../README.md`, totalReport);
})

/**
* Output relation list csv
*
* @author Michael Hsu
*/

.then(()=> {
  console.log(`>> Output file to ${path}/answer.list.txt`);

  let result = '';

  usersMap.forEach((tweets, uid)=> {
    tweets.forEach((value, mid)=> {
      if ((userList.indexOf(uid) > -1) && (tweetList.indexOf(mid) > -1)) {
        result = `${result}${userList.indexOf(uid) + 1} ${tweetList.indexOf(mid) + 1} ${value}\n`
      }
      else {
        usersMap.get(uid).delete(mid);
      }
    });

    if (tweets.size <= 1) {
      usersMap.delete(uid);
    }
  });

  return fs.writeFileAsync(`${path}/answer.list.txt`, result);
})

/**
* Training / Testing
*
* @author Michael Hsu
*/

.then(()=> {

  console.log(`>> Output file to ${path}/[train] [test].list.txt`);

  function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  };

  let trainResult = '';
  let testResult = '';

  usersMap.forEach((tweets, uid)=> {
    let size = tweets.size;
    let testingSize = Math.ceil(size * 0.1);
    let array = []

    for (let i = 0; i < testingSize; i++) {
      array.push(true);
    }

    for (let i = 0; i < (size - testingSize); i++) {
      array.push(false);
    }

    shuffle(array);
    let k = 0;
    tweets.forEach((value, mid)=> {
      if (array[k]) {
        testResult = `${testResult}${userList.indexOf(uid) + 1} ${tweetList.indexOf(mid) + 1} ${value}\n`
      }
      else {
        trainResult = `${trainResult}${userList.indexOf(uid) + 1} ${tweetList.indexOf(mid) + 1} ${value}\n`
      }

      k = k + 1;
    });
  });

  fs.writeFileAsync(`${path}/train.list.txt`, trainResult);
  fs.writeFileAsync(`${path}/test.list.txt`, testResult);
})

/**
* Output all rank list
*
* @author Michael Hsu
*/

.then(()=> {
  let result = '';

  userList.forEach((uid, uindex) => {
    tweetList.forEach((mid, mindex) => {
      if (usersMap.get(uid).has(mid)) {
        result = `${result}${uindex + 1} ${mindex + 1} ${usersMap.get(uid).get(mid)}\n`
      }
      else {
        result = `${result}${uindex + 1} ${mindex + 1} 0\n`
      }
    });
  });

  fs.writeFileAsync(`${path}/test.rank.list.txt`, result);
})

/**
* Output all rank list
*
* @author Michael Hsu
*/

.then(()=> {
  let result = '';
  let midArray = [];
  let valueArray = [];

  tweetList.forEach((mid, index) => {
    midArray.push(index + 1);
    valueArray.push(parseInt(tweetsMap.get(mid).size));
  });

  let sortArray = [];
  let size = tweetList.length;
  for (let s = 0; s < size; s++) {
    let max = Math.max(...valueArray);
    let maxIndex = valueArray.indexOf(max);
    let maxMid = midArray[maxIndex];

    sortArray.push(maxMid);
    midArray.splice(maxIndex, 1);
    valueArray.splice(maxIndex, 1);
  }

  result = sortArray.reduce((total, value) => {
    return `${total} ${value}`
  });

  let totalResult = '';

  for (var i = 0; i < userList.length; i++) {
    totalResult = `${totalResult}${result}\n`
  };

  fs.writeFileAsync(`${path}/answer.popularity.txt`, totalResult);
})

/**
* Output relation csv
*
* @author Michael Hsu
*/

// .then(()=> {
//   console.log(`>> Output file to ${path}/tweets.txt`);

//   let result = '';

//   userList.forEach((uid)=> {
//     tweetList.forEach((mid)=> {
//       if (usersMap.get(uid).get(mid)) {
//         result = `${result}${usersMap.get(uid).get(mid)},`
//       }
//       else {
//         result = `${result}0,`
//       }
//     });

//     result = result.slice(0, -1);  //去掉最後一個逗號
//     result = `${result}\n`

//   });

//   return fs.writeFile(`${path}/answer.matrix.csv`, result);
// })

/**
* Output tweet bias csv
*
* @author Michael Hsu
*/

// .then(()=> {
//   console.log(`>> Output file to ${path}/relations.csv`);
//   let tweetsBiasResult = '';

//   usersMap.forEach((u)=> {
//     tweetsMap.forEach((value, t)=> {
//       let r = tweetsBiasMap.get(t);
//       tweetsBiasResult = `${tweetsBiasResult}${
//         r.t_retweeted_counts / t_retweeted_counts_total / tweetsBiasMap.size +
//         r.t_mention_counts +
//         r.t_mention_counts +
//         r.t_url_counts +
//         r.t_expression_counts +
//         r.t_topic_counts},`
//     });
//     tweetsBiasResult = tweetsBiasResult.slice(0, - 1);  //去掉最後一個逗號
//     tweetsBiasResult = `${tweetsBiasResult}\n`
//   });

//   return fs.writeFile(`${path}/tweetsBias.csv`, tweetsBiasResult);

// })

.then(()=> {
  fs.writeFile(`${path}/model.txt`, '');
  fs.writeFile(`${path}/output.txt`, '');
})

.then(()=> {
  console.log(`>> done!`);
})

.catch((error)=> {
  console.log({error});
});
