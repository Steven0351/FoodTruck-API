'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _review = require('./review');

var _review2 = _interopRequireDefault(_review);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var foodtruckSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  foodType: {
    type: String,
    required: true
  },
  averageCost: Number,
  geometry: {
    type: { type: String, default: 'Point' },
    coordinates: {
      lat: Number,
      long: Number
    }
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
});

module.exports = _mongoose2.default.model('FoodTruck', foodtruckSchema);
//# sourceMappingURL=foodtruck.js.map