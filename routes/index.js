var express = require('express');
var router = express.Router();
var jsonQuery = require('json-query')

var sabreDevStudioFlight = require('sabre-dev-studio/lib/sabre-dev-studio-flight');
var sabreConfig = require('../config/sabre_config');
var citiesConfig = require('../config/cities.json');
var airports = require('../config/airports.json');
var sabre = new sabreDevStudioFlight(sabreConfig);

function response(res, error, data) {
  if (error) {
    res.status(200).send({
        'status': false,
        'message': 'Error',
        'info': error
    });
  } else {
    res.status(200).send({
        'status': true,
        'message': 'Success',
        'info': data
    });
  }
};

function response2(res, error, data) {
  if (error) {
    res.status(200).send({
        'status': false,
        'message': 'Error',
        'info': error
    });
  } else {
      // create a new JSON object and insert every element from data and include airport/city name
      var destinations = [];
      for(var i = 0; i < data.FareInfo.length; i++) {
        //  destinations.push(data.FareInfo[i]);
        var airportName = jsonQuery('Airports[AirportCode=' + data.FareInfo[i].DestinationLocation + '].AirportName', {data: airports}).value;
        destinations[i] = {
             CurrencyCode: data.FareInfo[i].CurrencyCode,
             LowestFare: data.FareInfo[i].LowestFare,
             AirportCode: data.FareInfo[i].DestinationLocation
        };
      }
      var result = { 
          OriginLocation: data.OriginLocation, 
          FareInfo: destinations
        };
      console.log(result);
      res.status(200).send({
          'status': true,
          'message': 'Success',
          'info': result
      });
  }
};

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/cities', function(req, res) {
    // var options = {};
    // sabre.multiairport_city_lookup(options, function(error, data) {
    //     response(res, error, data);
    // });
    response(res, false, citiesConfig);
});

router.get('/airports', function(req, res) {
    response(res, false, airports)
})

router.get('/fares', function(req, res) {
    var options = {
        origin: 'NYC',
        departuredate: '2016-06-25',
        returndate: '2016-06-28',
        maxfare: 200
    };
    sabre.destination_finder(options, function(error, data) {
        response(res, error, data);
    });
});

router.get('/search', function(req, res) {
    var options = {
        origin              : req.query.origin,
        departuredate       : req.query.departuredate,
        returndate          : req.query.returndate,
        maxfare             : req.query.maxfare,
        pointofsalecountry  : req.query.pointofsalecountry
    };
    sabre.destination_finder(options, function(error, data) {
        // console.log(JSON.parse(data).OriginLocation);
        // console.log((JSON.parse(data)).FareInfo);
        response2(res, error, JSON.parse(data));
    });
});

router.get('/citypairs', function(req, res) {
    // var options = {};
    // sabre.city_pairs_lookup(options, function(error, data) {
    //     response(res, error, data);
    // });
    response(res, false, cityPairsConfig);
});

router.get('/populateAirports', function(req, res) {
    populateAirports(res, cityPairsConfig);
})

function populateAirports(res, cityPairs) {
    var pairs = cityPairsConfig.OriginDestinationLocations;
    var arr1 = [];
    var arr2 = [];
    for (var i = 0; i < pairs.length; i++) {
        if (arr1.indexOf(pairs[i].OriginLocation.AirportCode) < 0) {
            arr1.push(pairs[i].OriginLocation.AirportCode);
            arr2.push({
                AirportCode:    pairs[i].OriginLocation.AirportCode,
                AirportName:    pairs[i].OriginLocation.AirportName,
                CityName:       pairs[i].OriginLocation.CityName,
                CountryCode:    pairs[i].OriginLocation.CountryCode,
                CountryName:    pairs[i].OriginLocation.CountryName,
                RegionName:     pairs[i].OriginLocation.RegionName
            });
        }
    }
    for (var i = 0; i < pairs.length; i++) {
        if (arr1.indexOf(pairs[i].DestinationLocation.AirportCode) < 0) {
            arr1.push(pairs[i].DestinationLocation.AirportCode);
            arr2.push({
                AirportCode:    pairs[i].DestinationLocation.AirportCode,
                AirportName:    pairs[i].DestinationLocation.AirportName,
                CityName:       pairs[i].DestinationLocation.CityName,
                CountryCode:    pairs[i].DestinationLocation.CountryCode,
                CountryName:    pairs[i].DestinationLocation.CountryName,
                RegionName:     pairs[i].DestinationLocation.RegionName
            });
        }
    }
    // console.log(arr1.length);
    // console.log(arr2.length);
    res.status(200).send(arr2);
}

module.exports = router;
