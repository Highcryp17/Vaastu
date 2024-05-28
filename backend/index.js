const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Web3 } = require('web3');
const Property = require('./property'); // Import the Property model
const UserRegistration = require('../build/contracts/UserRegistration.json'); // Import the UserRegistration ABI
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/real-estate', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Load contract ABIs
const propertyTokenABI = require('../build/contracts/PropertyToken.json').abi;
const propertyTokenAddress = process.env.CONTRACT_ADDRESS;

const fractionalOwnershipABI = require('../build/contracts/FractionalOwnership.json').abi;
const fractionalOwnershipAddress = process.env.FRACTIONAL_OWNERSHIP_CONTRACT_ADDRESS;

const rentalIncomeDistributionABI = require('../build/contracts/RentalIncomeDistribution.json').abi;
const rentalIncomeDistributionAddress = process.env.RENTAL_INCOME_DISTRIBUTION_CONTRACT_ADDRESS;

// Endpoint to serve contract addresses and ABIs
app.get('/contract', (req, res) => {
  try {
    res.json({
      propertyTokenAddress,
      propertyTokenABI,
      fractionalOwnershipAddress,
      fractionalOwnershipABI,
      rentalIncomeDistributionAddress,
      rentalIncomeDistributionABI
    });
  } catch (err) {
    console.error('Contract fetch error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create collection for new user registration
app.post('/createCollection', async (req, res) => {
  const { aadhar } = req.body;
  try {
    await mongoose.connection.createCollection(aadhar);
    res.status(200).send('Collection created successfully');
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).send('Error creating collection');
  }
});

// Function to get user's Aadhar number from the blockchain
async function getUserAadharNumberFromBlockchain(walletAddress) {
  const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = UserRegistration.networks[networkId];
  const instance = new web3.eth.Contract(UserRegistration.abi, deployedNetwork && deployedNetwork.address);

  const user = await instance.methods.getUser(walletAddress).call();
  return user.aadhar;
}

// Property Schema
const propertySchema = new mongoose.Schema({
  name: String,
  location: String,
  price: Number,
  owner: String,
  tokenId: Number
});

// General Properties Schema
const generalPropertySchema = new mongoose.Schema({
  name: String,
  location: String,
  price: Number,
  owner: String,
  tokenId: Number
});

const GeneralProperty = mongoose.model('properties', generalPropertySchema);

// CRUD endpoints for properties
app.post('/properties', async (req, res) => {
  try {
    const { name, location, price, owner, tokenId } = req.body;
    const userAadharNumber = await getUserAadharNumberFromBlockchain(owner);

    if (!userAadharNumber) {
      throw new Error('User is not registered.');
    }

    // Use a dynamic model to save the property in the specific collection
    const PropertyModel = mongoose.model(userAadharNumber, propertySchema);
    const property = new PropertyModel({ name, location, price, owner, tokenId });
    await property.save();

    // Save the property to the general properties collection
    const generalProperty = new GeneralProperty({ name, location, price, owner, tokenId });
    await generalProperty.save();

    res.json(property);
  } catch (err) {
    console.error('Add property error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Fetch properties for a specific user by wallet address
app.get('/properties/owner/:owner', async (req, res) => {
  const { owner } = req.params;
  try {
    const userAadharNumber = await getUserAadharNumberFromBlockchain(owner);

    if (!userAadharNumber) {
      res.status(404).send('User has not added any property.');
      return;
    }

    const PropertyModel = mongoose.model(userAadharNumber, propertySchema);
    const properties = await PropertyModel.find();
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).send('Error fetching properties');
  }
});

// Fetch all properties for homepage listing
app.get('/properties', async (req, res) => {
  try {
    const properties = await GeneralProperty.find();
    res.json(properties);
  } catch (error) {
    console.error('Error fetching all properties:', error);
    res.status(500).send('Error fetching all properties');
  }
});

// Delete a property by IDs
app.delete('/properties/:userId/:generalId', async (req, res) => {
  const { userId, generalId } = req.params;
  const owner = req.query.owner;

  try {
    const userAadharNumber = await getUserAadharNumberFromBlockchain(owner);
    if (!userAadharNumber) {
      return res.status(404).send('User not registered');
    }

    // Delete the property from the specific user's collection
    const PropertyModel = mongoose.model(userAadharNumber, propertySchema);
    const userPropertyDeletion = await PropertyModel.findByIdAndDelete(userId);
    if (!userPropertyDeletion) {
      return res.status(404).send('Property not found in user collection');
    }

    // Delete the property from the general properties collection
    const generalPropertyDeletion = await GeneralProperty.findByIdAndDelete(generalId);
    if (!generalPropertyDeletion) {
      return res.status(404).send('Property not found in general collection');
    }

    res.status(200).send('Property deleted successfully');
  } catch (err) {
    console.error('Error deleting property:', err);
    res.status(500).send('Error deleting property');
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
