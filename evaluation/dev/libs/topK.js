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
      let tweetsDeepCopy = Deepcopy(tweets).sort();
      let prevMaxValue = 0;
      let counter = 0;
      let maxValue = 0;
      resultArray[index] = [];
      
      for(let k = 1; k <= topK; k++){
        // TODO: 有可能有重複的 value，早成取到重複的 value
        maxValue = tweetsDeepCopy.pop();

        if (maxValue != 0){
          for (let i = 0; i < tweets.length; i++) {
            if (tweets[i] == maxValue){
              if(counter > 0){
                counter = counter - 1;
                // continue;
              }
              else{
                resultArray[index].push(i);
                break;
              }
            }
          };
          // resultArray[index].push( tweets.indexOf(maxValue) );
          if (prevMaxValue == maxValue){
            counter = counter + 1;
            console.log({index, i, prevMaxValue, maxValue, counter});
            prevMaxValue = 0;
          }
          else{
            prevMaxValue = maxValue;
            counter = 0;
          }
        } 

        // else{
        //   break;
        // }
      }
      
    }
  });
  return resultArray;
}