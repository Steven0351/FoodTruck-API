'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _foodtruck = require('../model/foodtruck');

var _foodtruck2 = _interopRequireDefault(_foodtruck);

var _review = require('../model/review');

var _review2 = _interopRequireDefault(_review);

var _authMiddleware = require('../middleware/authMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // CRUD - Create Read Update Delete

  // '/v1/foodtruck/add' - Create
  api.post('/add', _authMiddleware.authenticate, function (req, res) {
    var newFoodTruck = new _foodtruck2.default();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodType = req.body.foodType;
    newFoodTruck.averageCost = req.body.averageCost;
    newFoodTruck.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
    newFoodTruck.geometry.coordinates.long = req.body.geometry.coordinates.long;

    newFoodTruck.save(function (err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'FoodTruck saved successfully' });
    });
  });

  // '/v1/foodtruck' - Read
  api.get('/', function (req, res) {
    _foodtruck2.default.find({}, function (err, foodtrucks) {
      if (err) {
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });

  // '/v1/foodtruck/:id' - Read 1
  api.get('/:id', function (req, res) {
    _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
      if (err) {
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  // get reviews for a specific food truck id - Read 2
  // 'v1/foodtruck/reviews/:id'
  api.get('/reviews/:id', function (req, res) {
    _review2.default.find({ foodtruck: req.params.id }, function (err, reviews) {
      if (err) {
        res.send(err);
      }
      res.json(reviews);
    });
  });

  // get foodtrucks that have an averagecost less than or equal to :averageCost parameter
  // 'v1/foodtruck/averageCost/:averageCost'
  api.get('/averageCost/:averageCost', function (req, res) {
    _foodtruck2.default.find({ averageCost: { $lte: req.params.averageCost } }, function (err, foodtrucks) {
      if (err) {
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });
  // get foodtrucks by foodType
  // '/v1/foodtruck/foodtype/:foodtype' - Read 3
  api.get('/foodType/:foodType', function (req, res) {
    _foodtruck2.default.find({ 'foodType': req.params.foodType }, function (err, foodtrucks) {
      if (err) {
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });

  // '/v1/foodtruck/:id' - Update
  api.put('/:id', _authMiddleware.authenticate, function (req, res) {
    _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
      if (err) {
        res.send(err);
      }
      foodtruck.name = req.body.name;
      foodtruck.foodType = req.body.foodType;
      foodtruck.averageCost = req.body.averageCost;
      foodtruck.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
      foodtruck.geometry.coordinates.long = req.body.geometry.coordinates.long;
      foodtruck.save(function (err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: "FoodTruck info updated" });
      });
    });
  });

  // '/v1/foodtruck/:id' - Delete
  api.delete('/:id', _authMiddleware.authenticate, function (req, res) {
    _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (foodtruck === null) {
        res.status(404).send('FoodTruck not found');
        return;
      }
      _foodtruck2.default.remove({
        _id: req.params.id
      }, function (err, foodtruck) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        _review2.default.remove({
          foodtruck: req.params.id
        }, function (err, review) {
          if (err) {
            res.send(err);
          }
          res.json({ message: 'FoodTruck successfully removed' });
        });
      });
    });
  });

  // add review for a specific foodtruck id
  // 'v1/foodtruck/reviews/add/:id'
  api.post('/reviews/add/:id', _authMiddleware.authenticate, function (req, res) {
    _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
      if (err) {
        res.send(err);
      }
      var newReview = new _review2.default();

      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.foodtruck = foodtruck._id;
      newReview.save(function (err, review) {
        if (err) {
          res.send(err);
        }
        foodtruck.reviews.push(newReview);
        foodtruck.save(function (err) {
          if (err) {
            res.send(err);
          }
          res.json({ message: 'Food truck review saved!' });
        });
      });
    });
  });

  return api;
};
//# sourceMappingURL=foodtruck.js.map