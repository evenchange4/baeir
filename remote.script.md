## Training 
./../../Downloads/libmf-1.2/mf-train -l 0.005 -k 100 -t 3000 -r 0.05 -s 1 output/count_time/preprocess/train.list.txt output/count_time/preprocess/model.txt
real tr_rmse = 0.0003

## Testing RMSE
./../../Downloads/libmf-1.2/mf-predict output/count_time/preprocess/test.list.txt output/count_time/preprocess/model.txt output/count_time/preprocess/output.txt
RMSE = 3.7172

## Testing Rank
./../../Downloads/libmf-1.2/mf-predict output/count_time/preprocess/test.rank.list.txt output/count_time/preprocess/model.txt output/count_time/preprocess/output.rank.txt
RMSE = 0.6493

## Evalutaion
babel-node preprocess/dev/es6/6_getAnswer.js output/count_time/preprocess/answer.list.txt

babel-node preprocess/dev/es6/7_getResult.js output/count_time

time Rscript models/evaluation.r output/count_time/preprocess/result.txt output/count_time/preprocess/answer.txt

## Popularity
time Rscript models/evaluation.r output/count_time/preprocess/answer.popularity.txt output/count_time/preprocess/answer.txt