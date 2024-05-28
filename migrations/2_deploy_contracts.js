const PropertyToken = artifacts.require("PropertyToken");
const FractionalOwnership = artifacts.require("FractionalOwnership");
const RentalIncomeDistribution = artifacts.require("RentalIncomeDistribution");
const UserRegistration = artifacts.require("UserRegistration");

module.exports = async function (deployer) {
  await deployer.deploy(PropertyToken);
  await deployer.deploy(FractionalOwnership);
  await deployer.deploy(RentalIncomeDistribution);
  await deployer.deploy(UserRegistration);
};
