var request = require('request');
var moment = require('moment');
var Twitter = require('twitter');
const TelegramBot = require('node-telegram-bot-api');
var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});
				var fs = require('fs');



const bot = new TelegramBot("KEY_HERE", {polling: false});


var currentCount;
function loopJob() {
	request('https://www.apple.com/ios/feature-availability/', function (error, response, body) {
		//console.log('error:', error); // Print the error if one occurred
		//console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		//console.log('body:', body); // Print the HTML for the Google homepage.


		var count = (body.match(/Republic of Korea/g) || []).length;
		

		if(!error) {
			if(!currentCount){
				console.log("초기화");
				currentCount = count;
				fs.writeFile(__dirname + "/log/" + moment().utcOffset(9).format("YMMDD HHmmss") + ".html", body, function(err) {
				    if(err) {
				        return console.log(err);
				    }

				    console.log("The file was saved!");
				}); 

			}
			if(currentCount > 0 && currentCount < 100) {
				if(count != currentCount) {
					var str = "새로운 애플 서비스가 출시된 것 같습니다!\n" + currentCount + "개 > " + count + "개\nhttps://www.apple.com/ios/feature-availability/"
					console.log(moment().utcOffset(9).format("Y/MM/DD HH:mm:ss") + " " + str);
					sendMessage(str);
					currentCount = count;
					fs.writeFile(__dirname + "/log/" + moment().utcOffset(9).format("YMMDD HHmmss") + ".html", body, function(err) {
					    if(err) {
					        return console.log(err);
					    }

					    console.log("The file was saved!");
					}); 
				} else {
					console.log(moment().utcOffset(9).format("Y/MM/DD HH:mm:ss") + " 변화 없음 (" + count + ")");
				}
			}
		}

		setTimeout(loopJob, 5000);
	});
}
function sendMessage(str) {
  bot.sendMessage(ROOM_HERE, str);
  client.post('statuses/update', {status: str})
  .then(function (tweet) {
    console.log("트위터 포스팅 성공");
  })
  .catch(function (error) {
    console.log("트위터 포스팅 오류 발생");
  });



}



loopJob();

