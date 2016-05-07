var express = require('express');
var router = express.Router();

var sabreDevStudioFlight = require('sabre-dev-studio/lib/sabre-dev-studio-flight');
var sabreConfig = require('../config/sabre_config');
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
        'info': JSON.stringify(JSON.parse(data))
    });
  }
};

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/cities', function(req, res) {
    var options = {};
    sabre.multiairport_city_lookup(options, function(error, data) {
        response(res, error, data);
    });
});

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
        response(res, error, data);
    });
});

module.exports = router;
