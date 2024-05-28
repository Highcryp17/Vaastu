const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: String,
  location: String,
  price: Number,
  owner: String, // Wallet address
  tokenId: Number
});

const Property = mongoose.model('Property', propertySchema, 'properties'); // Explicitly set collection name if needed

module.exports = Property;
