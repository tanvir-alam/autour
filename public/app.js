var app = angular.module('autour', ['ngRoute']);

// create the controller and inject Angular's $scope
app.controller('mainController', function($scope, $http) {

    // create a message to display in our view
    $scope.message = "Give us your budget and we'll tell you where you can fly to!";
    
    $scope.submit = function() {
        $http.get('/search?origin=' + $scope.info.origin +
            '&departuredate=' + $scope.info.departuredate +
            '&returndate=' + $scope.info.returndate +
            '&maxfare=' + $scope.info.maxfare)
        .success(function(data) {
            $scope.results = data;
            $scope.data = data.info;
            if ($scope.results.status) {
                $scope.fareinfo = JSON.parse($scope.data).FareInfo;
            } else {
                $scope.error = JSON.parse($scope.data.data).message;
            }
        })
        .error(function(error) {
            $scope.error = JSON.parse(error.data).message;
        });
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
