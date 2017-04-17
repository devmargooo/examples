angular.module('applications')
  .controller('AppCardController', function($http, $routeParams){
    var appcard = this;
    if ($routeParams.id<0) $routeParams.id = 0;
    if ($routeParams.id>8) $routeParams.id = 8;

    $http({method:'GET', url:'api/apps_info.json'})
      .then(function(result){
        appcard.data = result.data;
        appcard.id = $routeParams.id;
        appcard.item = appcard.data[$routeParams.id];
      }, function(err){
        console.log("LOADING ERROR!");
      });
  });
