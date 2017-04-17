(function (){

	var app = angular.module('applications', ["applications-directives", "ngRoute"]);
	app.config(function($routeProvider){
		$routeProvider
        .when('/categories',{
            templateUrl:'/templates/table/index.html',
						controller:'ProductTableController',
						controllerAs:'productstable'
        })
        .when('/',{
            templateUrl:'/templates/table/index.html',
						controller:'ProductTableController',
						controllerAs:'productstable'
        })
				.when('/app/:id',{
        	templateUrl:'/templates/card/index.html',
        	controller: 'AppCardController',
					controllerAs: 'appcard'
				})
        .otherwise({redirectTo:'/'})
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

})();
