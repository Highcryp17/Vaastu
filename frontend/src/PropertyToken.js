import getWeb3 from './web3';
import PropertyToken from './contracts/PropertyToken.json';

const getContract = async () => {
  const web3 = await getWeb3();
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = PropertyToken.networks[networkId];
  const instance = new web3.eth.Contract(
    PropertyToken.abi,
    deployedNetwork && deployedNetwork.address,
  );
  return instance;
};

export default getContract;
