angular.module('applications')
  .controller('ProductTableController', function($http){
    var productstable = this,
    monthMap = {
  		0: "января",
  		1: "февраля",
  		2: "марта",
  		3: "апреля",
  		4: "мая",
  		5: "июня",
  		6: "июля",
  		7: "августа",
  		8: "сентября",
  		9: "октября",
  		10: "ноября",
  		11: "декабря"
  	};

    this.parseDate = function(date){
			var parsedDate = new Date(date*1000);
			var day = parsedDate.getDate();
			if (day < 10) day = '0' + day;
			var month = monthMap[parsedDate.getMonth()];
			var year = parsedDate.getFullYear();
			return day + ' ' + month + ' '+ year;
		};

    $http({method:'GET', url:'api/apps_info.json'})
      .then(function(result){
        productstable.data = result.data;
      }, function(err){
        console.log("LOADING ERROR!");
      });
  });
