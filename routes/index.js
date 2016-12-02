var express = require('express');
var router = express.Router();
var jsonQuery = require('json-query');

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

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/cities', function(req, res) {
    response(res, false, citiesConfig);
});

router.get('/airports', function(req, res) {
    response(res, false, airports)
})

router.get('/search', function(req, res) {
    var options = {
        origin              : req.query.origin,
        departuredate       : req.query.departuredate,
        returndate          : req.query.returndate,
        maxfare             : req.query.maxfare,
        pointofsalecountry  : req.query.pointofsalecountry
    };
    sabre.destination_finder(options, function(error, data) {
        response(res, error, getDestinationInfo(JSON.parse(data)));
    });
});



function getDestinationInfo(data) {
    var destinations = [];
    for(var i = 0; i < data.FareInfo.length; i++) {
    destinations[i] = {
            CurrencyCode: data.FareInfo[i].CurrencyCode,
            LowestFare: data.FareInfo[i].LowestFare,
            AirportCode: data.FareInfo[i].DestinationLocation,
            AirportName: jsonQuery('Airports[AirportCode=' + data.FareInfo[i].DestinationLocation + '].AirportName', {data: airports}).value,
            CityName: jsonQuery('Airports[AirportCode=' + data.FareInfo[i].DestinationLocation + '].CityName', {data: airports}).value,
            CountryName: jsonQuery('Airports[AirportCode=' + data.FareInfo[i].DestinationLocation + '].CountryName', {data: airports}).value
    };
    }
    var result = { 
        OriginLocation: data.OriginLocation, 
        FareInfo: destinations
    };
    return result;
};

module.exports = router;
