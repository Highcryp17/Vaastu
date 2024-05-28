import React, { useState } from 'react';
import Web3 from 'web3';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import UserRegistration from '../contracts/UserRegistration.json'; // Path to your compiled contract
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [name, setName] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [pan, setPan] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const registerUser = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setError('MetaMask is not installed. Please install MetaMask and try again.');
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      console.log(`Using account: ${account}`);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = UserRegistration.networks[networkId];
      if (!deployedNetwork) {
        setError('Smart contract not deployed on the detected network.');
        return;
      }

      const instance = new web3.eth.Contract(
        UserRegistration.abi,
        deployedNetwork && deployedNetwork.address,
      );

      await instance.methods.register(name, aadhar, pan, walletAddress).send({
        from: account,
        gas: 3000000 // Adjust gas limit if needed
      });

      await fetch('http://localhost:3001/createCollection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhar }),
      });

      setSuccess('User registered successfully!');
      setError(null);
    } catch (err) {
      console.error('Error occurred:', err);
      setError(err.message);
      setSuccess(null);
    }
  };

  const signInUser = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setError('MetaMask is not installed. Please install MetaMask and try again.');
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      console.log(`Using account: ${account}`);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = UserRegistration.networks[networkId];
      if (!deployedNetwork) {
        setError('Smart contract not deployed on the detected network.');
        return;
      }

      const instance = new web3.eth.Contract(
        UserRegistration.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const user = await instance.methods.getUser(account).call();
      console.log(`User data: ${JSON.stringify(user)}`);

      if (user.walletAddress === '0x0000000000000000000000000000000000000000') {
        setError('User not registered. Please register first.');
        return;
      }

      // Redirect to UserDashboard with user data
      navigate('/dashboard', { state: { user } });
    } catch (err) {
      console.error('Error occurred:', err);
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Register / Sign In</h1>
          <Form>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input type="text" id="name" value={name} onChange={e => setName(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="aadhar">Aadhaar Number</Label>
              <Input type="text" id="aadhar" value={aadhar} onChange={e => setAadhar(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="pan">PAN Number</Label>
              <Input type="text" id="pan" value={pan} onChange={e => setPan(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="walletAddress">Wallet Address</Label>
              <Input type="text" id="walletAddress" value={walletAddress} onChange={e => setWalletAddress(e.target.value)} />
            </FormGroup>
            <Button color="primary" onClick={registerUser}>Register</Button>
            <Button color="secondary" onClick={signInUser} style={{ marginLeft: '10px' }}>Sign In</Button>
          </Form>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {success && <div style={{ color: 'green' }}>{success}</div>}
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
