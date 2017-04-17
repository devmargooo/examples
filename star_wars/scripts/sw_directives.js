(function (){

	var app = angular.module('sw-directives',[]);
  app.directive('cards', function(){
		return {
			restrict:'EA',
      templateUrl: "templates/cards.html",
			scope:{
				data: "=data",
				filter: "=filter"
			}
		};
	});

})();
