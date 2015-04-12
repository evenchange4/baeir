"use strict";

// node_modules
import console from "gulp-util";
import Deepcopy from "deepcopy";

/**
* Extract feature from raw tweets
*
* @input  (file) csv
* @input  (int)  topK
*
* @output (array) [[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5],...]
*
* 1. parse csv
* 2. find topK index
*
* @author Michael Hsu
*/

export default function topK(data, topK) {
  let resultArray = [];

  data.split('\n').forEach((line, index)=>{
    if(line !== ""){
      let tweets = line.split(',');
      let tweetsDeepCopy = Deepcopy(tweets);
      resultArray[index] = []
      
      for(let i = 1; i <= topK; i++){
        let maxValue = tweetsDeepCopy.sort().pop();
        if (maxValue != 0){
          resultArray[index].push( tweets.indexOf(maxValue) );
        } 
      }
      
    }
  });
  return resultArray;
}