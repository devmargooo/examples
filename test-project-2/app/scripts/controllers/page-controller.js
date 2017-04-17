angular.module('applications')
  .controller('PageController', ['$document', function($document){
    this.contentPhase = -1;
    this.isSelected = function(pageContentPhase){
      return this.contentPhase === pageContentPhase;
    }
    this.setContentPhase = function(value){
      this.contentPhase = value;
    }
  }]);
