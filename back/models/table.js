const mongoose = require('mongoose');
const validator = require('validator');

const tableSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  name: {
    type: String,
    minlength: 2,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('table', tableSchema);
