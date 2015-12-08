


var app = angular.module('myApp', []),

 apiKey='MDExODQ2OTg4MDEzNzQ5OTM4Nzg5MzFiZA001',
 nprUrl = 'http://api.npr.org/query?id=61&fields=relatedLink,title,byline,text,audio,image,pullQuote,all&output=JSON';

 
 app.factory('audio', ['$document', function($document) {
  var audio = $document[0].createElement('audio');
  return audio;
}]);



app.factory('player', function(audio,$rootScope){
	var player={
		playing:false,
		current:null,
		progress:0,
		ready:false,
		play: function(program){
			
			if (player.playing)
				player.stop();
			
			
			var url= program.audio[0].format.mp4.$text;
			player.current=program;
			audio.src=url;
			audio.play();
			player.playing=true;
		},
			stop: function (){
				if ( player.playing){
					audio.pause();
					
				layer.playing=false;
					player.current=null;
				}
				
			},
			    currentTime: function() {
      return audio.currentTime;
    },
    currentDuration: function() {
      return audio.duration;
    }
			
			
		};
		
		audio.addEventListener('canplay', function(evt){
			$rootScope.$apply(function(){
				player.ready=true;
			});
		});
		
	
		audio.addEventListener('timeupdate', function(evt) {
    $rootScope.$apply(function() {
      player.progress = player.currentTime();
      player.progress_percent = player.progress / player.currentDuration();
    });
  });
	audio.addEventListener('ended', function(){
		$rootScope.$apply(player.stop());
		
	});
	
	
	return player;
	
});




app.factory('nprServive',  function($http){
	var doRequest=function(apiKey){
		
		return $http({
			method: 'JSONP',
			url: nprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
			
		});
		
		
	}
	
	return {
		programs: function(apiKey){ return doRequest(apiKey); }
	};
	
});



 app.directive('nprLink', function(){
	return{
		restrict:'EA',
		require:['^ngModel'],
		replace:true,
		scope: {
			ngModel:'=',
			player:'=',
			
			
		},
		
		templateUrl:'./views/nprListItem.html',
		link: function(scope, ele, attr){
			 scope.duration=scope.ngModel.audio[0].duration.$text;
			
		}

	}
});

app.directive('playerView', [function(){
  
  return {
    restrict: 'EA',
    require: ['^ngModel'],
    scope: {
      ngModel: '='
    },
    templateUrl: './views/playerView.html',
    link: function(scope, iElm, iAttrs, controller) {
      scope.$watch('ngModel.current', function(newVal) {
        if (newVal) {
          scope.playing = true;
          scope.title = scope.ngModel.current.title.$text;
          scope.$watch('ngModel.ready', function(newVal) {
            if (newVal) {
              scope.duration = scope.ngModel.currentDuration();
            }
          });

          scope.$watch('ngModel.progress', function(newVal) {
            scope.secondsProgress = scope.ngModel.progress;
            scope.percentComplete = scope.ngModel.progress_percent;
          });
        }
      });
      scope.stop = function() {
        scope.ngModel.stop();
        scope.playing = false;
      }
    }
  };
}]);




app.controller('ParentController', function($scope) {
  $scope.person = {greeted: false};
  
});



app.controller('RelatedController', function($scope, player)

{
		$scope.player=player;
		
	$scope.$watch('player.current', function(newVal){
		if (newVal){
			$scope.related= [];
			angular.forEach(newVal.relatedLink, function(link){
				
				$scope.related.push({
					link: link.link[0].$text,
					caption: link.caption.$text });
				
			});
			
		}
	});
	
});


app.controller('PlayerController', function($scope, nprService, player) {
  $scope.player = player;
  nprService.programs(apiKey)
    .success(function(data, status) {
      $scope.programs = data.list.story;
    })
});


app.controller('PlayerController', ['$scope', '$http',
 function($scope, $http){
	var audio =document.createElement('audio');
	$scope.audio=audio;
	$scope.audio.src='http://pd.npr.org/npr-mp4/npr/sf/2013/07/20130726_sf_05.mp4?orgId=1&topicId=1032&ft=3&f=61'; 
 	
	$scope.play = function(program) {
		if ($scope.playing) audio.pause();
	
	
		var url = program.audio[0].format.mp4.$text;
		audio.src=url;
		audio.play();
			$scope.playing=true;
	}
	$scope.stop=function(){
		audio.pause();
		$scope.playing=false;
	};
	/* $scope.audio.addEventListener('ended', function(){
		$scope.$apply(function () {
			
			$scope.stop()
		});
		
	}); */
	
	
	

	$http({
	method:'JSONP',
	url: nprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
	
}).success(function(data, status){
	   // Now we have a list of the stories (data.list.story)
    // in the data object that the NPR API 
    // returns in JSON that looks like:
    // data: { "list": {
    //   "title": ...
    //   "story": [
    //     { "id": ...
    //       "title": ...
	
 $scope.programs = data.list.story;
	
}).error(function(data, status){
	
});


}]);

 angular.module('myApp.services', [])
 .factory('githubService', ['$http', function($http){
	 
	var githubUsername;
	var doRequest = function(path){
		return $http({
			method: 'JSONP',
			url: 'https://api.github.com/D-L-C/' + githubUsername + '/' + path + '?callback=JSON_CALLBACK'
	
		});
	}
	
	return {
		events: function() { return doRequest('events'); },
		setUsername: function(newUsername) { githubUsername = newUsername; }
		
	};
	 
 }]);
 
 /* app.controller('ServiceController', ['$scope','$timeout', 'githubService',
    function($scope,$timeout, githubService) {
		
		
		var timeout;
		$scope.$watch('username', function(newVal){
			if(newVal){
				if (timeout) $timeout.cancel.(timeout);
				timeout=$timeout(function() {
					githubService.events(newVal)
					.success(function(data, status){
				
				$scope.events=data.data;
			});
				}, 350);
				
			}
		}); 
}]);*/





app.controller('FrameController', function($scope) {
});


app.controller('DemoController', ['$scope', function($scope){
	
	$scope.counter =0;
	$scope.add=function(amount) {$scope.counter += amount; };
	$scope.subtract=function(amount) { $scope.counter -= amount; };
	
}]);



app.run(function($rootScope){
	$rootScope.name="Ari Lerner";
	
});




app.controller('MyController', function($scope){
	
	$scope.person={
		name:"Ari Lerner"
	};
	
	var updateClock = function() {
		$scope.clock= new Date();
	};
	
	var timer = setInterval(function (){
		$scope.$apply(updateClock);
		
	}, 1000);
	
	updateClock();
});




app.controller('ChildController', function($scope){
	$scope.sayHello=function(){
		$scope.person.greeted=true;
	}
	$scope.Reset=function(){
		$scope.person.greeted=false;
	}
	
	
});