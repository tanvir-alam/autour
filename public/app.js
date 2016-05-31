var app = angular.module('autour', ['ngRoute', 'ngMaterial']);

// create the controller and inject Angular's $scope
app.controller('mainController', function($scope, $http) {
    
    var self = this;
    
    // header text to display on page
    $scope.header = "Give us your budget and we'll tell you where you can fly to!";
    
    $http.get('/cities').success(function(data) {
        $scope.cities = (JSON.parse(data.info)).Cities;
    }).error(function(error) {
        $scope.error = error;
    });
    
    $http.get('/airports').success(function(data) {
        $scope.airports = (JSON.parse(data.info)).Airports;
    }).error(function(error) {
        $scope.error = error;
    });
    
    self.selectedItem = null;
    self.searchText = null;
    self.querySearch = querySearch;
    
    function selectedItemChange(item) {
        self.selectedItem = item;
    }
    
    function querySearch(query) {
        var results = query ? $scope.airports.filter( createFilterFor(query) ) : [];
        return results;
    };
    
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(airport) {
            return ( (angular.lowercase(airport.CityName).indexOf(lowercaseQuery) === 0) || (angular.lowercase(airport.AirportCode).indexOf(lowercaseQuery) === 0) );
        };
    }
    
    $scope.submit = function() {
        console.log(self.selectedItem.AirportCode);
        $scope.results = null;
        $http.get('/search?origin=' + self.selectedItem.AirportCode +
            '&departuredate=' + $scope.info.departuredate +
            '&returndate=' + $scope.info.returndate +
            '&maxfare=' + $scope.info.maxfare +
            '&pointofsalecountry=' + self.selectedItem.CountryCode)
        .success(function(data) {
            $scope.results = data;
            $scope.data = data.info;
            if ($scope.results.status) {
                $scope.fareinfo = JSON.parse($scope.data).FareInfo;
                // $scope.fareinfo = ($scope.data).FareInfo;
            } else {
                $scope.error = JSON.parse($scope.data.data).message;
            }
        })
        .error(function(error) {
            $scope.error = JSON.parse(error.data).message;
        });
    };
});

app.directive('getResults', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.on('click', function() {
                $('html,body').animate({scrollTop: $('#results').offset().top}, 1000);
            });
        }
    }; 
});

app.controller('searchController', function($scope) {

    // create a message to display in our view
    $scope.cities = "List of cities goes here";
});

app.config(function($routeProvider) {
    $routeProvider
        
        .when('/search', {
            templateUrl : 'partials/search.html',
            controller  : 'searchController'
        });
});
