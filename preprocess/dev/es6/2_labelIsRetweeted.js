import Promise from 'bluebird';
import console from 'gulp-util';

// self project modules
import $sequelize from '../libs/sequelize';
import * as $sql from '../libs/sql';

// Model Schema
const Tweets = $sequelize.Tweets;

/**
* 1. 是否被轉錄過 isRetweeted
* 2. 計算 retweeted_counts 被轉錄多少次
*
* @author Michael Hsu
*/

Promise.resolve()
.then(()=> {
  // 1. 找出所有 retweeted_status_mid
  return $sequelize.sequelize.query($sql.isRetweeted, null, { raw: true });
})

.then((data)=> {
  console.log(`>> number of data has been retweeted = ${data[0].length}`);
  return data[0];
})

.each((data)=> {

  /**
  * 是否被轉錄過 isRetweeted
  * 計算 retweeted_counts  被轉錄多少次
  *
  * @param  {string} retweeted_status_mid
  *
  * @return {Boolean} isRetweeted = true
  * @return {int} retweeted_counts + 1
  *
  * @author Michael Hsu
  */

  let {retweeted_status_mid, retweeted_counts} = data;

  return Tweets.update(
    { isRetweeted: true, retweeted_counts },
    { where: {  mid: retweeted_status_mid } }
  );
})

.then(()=> {
  console.log('>> Start async function processing ...');
})

.catch((error)=> {
  console.log(error);
});
