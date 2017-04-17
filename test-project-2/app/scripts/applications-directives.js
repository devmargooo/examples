(function (){

	var app = angular.module('applications-directives',[]);
	app.directive('products', function(){
		var templ = 'templates/table-template.html';
		var fl = 0;
		return {
			restrict:'EA',
      templateUrl: templ,
			scope:{
				data: "=data"
			}
		};
	});

	app.directive('card', function(){
		return{
			restrict:'E',
			templateUrl:"templates/app-card-template.html"
		}
	});

})();
