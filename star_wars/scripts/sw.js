(function (){

	var app = angular.module('sw', ['sw-directives']);
	var PERSONS = 22;
	var PAGE_COUNT = 3;

	app.controller('SWController', ['$http', function($http){
		this.people = people;
		this.genderFilter = 'male';
		this.initData = function(page){
			$http({
				  method: 'GET',
				  url: 'http://swapi.co/api/people/?page='+page
			}).then(function successCallback(response) {
					for (var i = 0; i<response.data.results.length; i++){
						people.push(response.data.results[i]);
					}
			  }, function errorCallback(response) {
			    console.log(response.status);
			  });
		};

		this.setGenderFilter = function(value){
			this.genderFilter = value;
		};
		this.getGenderFilter = function(){
			return this.genderFilter;
		}
		for (var i = 1; i <= PAGE_COUNT; i++){
			this.initData(i);
		}
	}]);

	app.controller('CardController', function(){
		this.isFull = 0;
		this.setFullState = function(value){
			this.isFull = value;
		}
		this.getFullState = function(){
			return this.isFull;
		}
	});

	app.controller('CardAreaController', function(){
		var cardarea = this;
		this.isFull = 0;
		this.setFullState = function(value){
			this.isFull = value;
		}
		this.getFullState = function(){
			return this.isFull;
		}

	});

	app.factory('httpq', function($http, $q){
		return{
				get: function(){
						var deffered = $q.defer();
						$http.get.apply(null, arguments)
								.then(deffered.resolve)
								.catch(deffered.resolve);
								return deffered.promise;
				}
		}
	});

	app.filter('genderFilter', function() {
		return function(array, gender) {
				console.log("gender is: " + gender);
				if (!array.length) return false;
				var item = array[array.length-1];
				if (item.gender == gender){
					console.log(item);
					return item;
				}
		}
	});

	var people = [];

})();
