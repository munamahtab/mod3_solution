(function() {
  'use strict';
  angular
    .module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
	.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
    .directive('foundItems', FoundItemsDirective);

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'directive.html',
      scope: {
        found: '<',
        onRemove: '&'
      },
      controller: FoundItemsDirectiveController,
      controllerAs: 'list',
      bindToController: true
    };
    return ddo;
  }

  function FoundItemsDirectiveController() {
    var list = this;

    list.isEmpty = function() {
      return list.found.length === 0;
    }
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var ctrl = this;

    ctrl.searchTerm = "";
    ctrl.items = [];

    ctrl.narrowIt = function() {
      if (ctrl.searchTerm === "") {
        ctrl.items = [];
        return;
      }

      var promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
      promise.then(function(response) {
        ctrl.items = response;
      })
      .catch(function(error) {
        console.log("Something went wrong", error);
      });
    };

    ctrl.removeItem = function(index) {
      ctrl.items.splice(index, 1);
    };
	  
  }

  MenuSearchService.$inject = ['$http','ApiBasePath'];
  function MenuSearchService($http,ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function(searchTerm) {
		searchTerm = searchTerm.toLowerCase();
        return $http({
          method: 'GET',
          url: (ApiBasePath + "/menu_items.json")
        }).then(function (result) {
       
        var items = result.data.menu_items;
        var foundItems = [];
		   items.forEach(function(obj) {
                    if (searchTerm != '') {
                        if ((obj.name.indexOf(searchTerm) != -1) 
						||(obj.short_name.indexOf(searchTerm) != -1)||(obj.description.indexOf(searchTerm) != -1)) {
                            foundItems.push(obj);
                        }
                    }
                })
		 
        return foundItems;
      });
    };
	
  }

}
)();