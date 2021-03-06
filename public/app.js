var app = angular.module('autour', ['ngRoute', 'ngMaterial', 'ngMessages']);

// create the controller and inject Angular's $scope
app.controller('mainController', function($scope, $http, $mdDialog) {
    
    var self = this;
    
    // header text to display on page
    $scope.header = "Give us your budget and we'll tell you where you can fly to!";
    
    $http.get('/cities').success(function(data) {
        $scope.cities = (data.info).Cities;
    }).error(function(error) {
        $scope.error = error;
    });
    
    $http.get('/airports').success(function(data) {
        $scope.airports = (data.info).Airports;
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
    
    function isValidForm(ev) {
        if (self.selectedItem == null) {
            console.log('Airport Code not found');
            return false;
        }
        if (!(/^[A-Z]{3}$/).test(self.selectedItem.AirportCode)) {
            return false;
        }
        if (!Date.parse($scope.info.departuredate)) {
            console.log('Departure Date is not valid.')
            return false;
        }
        if (!Date.parse($scope.info.returndate)) {
            console.log('Return Date is not valid.')
            return false;
        }
        if (!parseFloat($scope.info.maxfare)) {
            console.log('Budget is not valid.')
            return false;
        }
        return true;
    }
    
    function showResults(data) {
        if (data != null) {
            $scope.results = data;
            $scope.data = data.info;
            if ($scope.results.status) {
                $scope.fareinfo = $scope.data.FareInfo;
                // $scope.fareinfo = ($scope.data).FareInfo;
            } else {
                $scope.error = $scope.data.data.message;
            }
        }
        else {
            console.log("Empty response!");
        }
    }
    
    function showError(ev) {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#main')))
                .clickOutsideToClose(true)
                .title('No results found!')
                .textContent('Please change your search query and try again.')
                .ok('OK')
                .targetEvent(ev)
        );
    }
    
    $scope.submit = function(ev) {
        if (isValidForm(ev)) {
            console.log(self.selectedItem.AirportCode);
            $scope.results = null;
            $http.get('/search?origin=' + self.selectedItem.AirportCode +
                '&departuredate=' + $scope.info.departuredate +
                '&returndate=' + $scope.info.returndate +
                '&maxfare=' + $scope.info.maxfare +
                '&pointofsalecountry=' + self.selectedItem.CountryCode )
            .then(
                // successCallback
                function(response) {
                    if (response != null) {
                        $scope.results = response.data;
                        $scope.data = response.data.info;
                        if ($scope.results.status) {
                            $scope.fareinfo = $scope.data.FareInfo;
                        } else {
                            $scope.error = $scope.data.message;
                            showError(ev);
                        }
                    }
                    else {
                        console.log("Empty response!");
                        showError(ev);
                    }
                },
                // errorCallback
                function(responseError) {
                    console.log("Error:\n" + responseError);
                    showError(ev);
                }
            );
        }
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
