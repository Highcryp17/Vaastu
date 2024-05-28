import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Table, Form, FormGroup, Label, Input } from 'reactstrap';
import Web3 from 'web3';
import { getUserProperties } from '../api';

const UserDashboard = () => {
  const location = useLocation();
  const { user } = location.state || { user: {} };

  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [name, setName] = useState('');
  const [locationProperty, setLocationProperty] = useState('');
  const [price, setPrice] = useState('');
  const [tokenId, setTokenId] = useState('');

  let web3;

  // Ensure Web3 is initialized correctly
  if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
  } else if (typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  }

  const fetchUserProperties = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      console.log('Fetching properties for account:', account);

      const properties = await getUserProperties(account);
      setProperties(properties);
      setError(null);
    } catch (err) {
      setError('Failed to fetch properties');
      setProperties([]);
    }
  };

  useEffect(() => {
    fetchUserProperties();
  }, []);

  const handleEdit = (property) => {
    // Logic to handle property edit
  };

  const handleDelete = async (userId, generalId) => {
    try {
      const response = await fetch(`http://localhost:3001/properties/${userId}/${generalId}?owner=${user.walletAddress}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProperties(properties.filter(property => property._id !== userId));
      } else {
        const errorData = await response.text();
        throw new Error('Failed to delete property');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const addProperty = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      console.log('Adding property with account:', account);

      const propertyData = { name, location: locationProperty, price, owner: account, tokenId };
      console.log('Property data to send:', propertyData);

      const response = await fetch('http://localhost:3001/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Add property error:', errorData);
        throw new Error('Failed to add property');
      }

      const newProperty = await response.json();
      console.log('New property added:', newProperty);
      setProperties([...properties, newProperty]);
      setSuccess('Property added successfully!');
      setError(null);
      setName('');
      setLocationProperty('');
      setPrice('');
      setTokenId('');
    } catch (err) {
      console.error('Add property error:', err.message);
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>User Dashboard</h1>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Aadhaar:</strong> {user.aadhar}</p>
          <p><strong>PAN:</strong> {user.pan}</p>
          <p><strong>Wallet Address:</strong> {user.walletAddress}</p>
          <h2>Your Properties</h2>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {success && <div style={{ color: 'green' }}>{success}</div>}
          {properties.length === 0 && !error && <p>User has not added any property.</p>}
          {properties.length > 0 && (
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Owner</th>
                  <th>Token ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property, index) => (
                  <tr key={property._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{property.name}</td>
                    <td>{property.location}</td>
                    <td>{property.price}</td>
                    <td>{property.owner}</td>
                    <td>{property.tokenId}</td>
                    <td>
                      <Button color="warning" onClick={() => handleEdit(property)}>Edit</Button>
                      {' '}
                      <Button color="danger" onClick={() => handleDelete(property._id, property.generalId)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Add Property</h2>
          <Form>
            <FormGroup>
              <Label for="propertyName">Name</Label>
              <Input type="text" id="propertyName" value={name} onChange={e => setName(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="propertyLocation">Location</Label>
              <Input type="text" id="propertyLocation" value={locationProperty} onChange={e => setLocationProperty(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="propertyPrice">Price</Label>
              <Input type="number" id="propertyPrice" value={price} onChange={e => setPrice(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="propertyTokenId">Token ID</Label>
              <Input type="text" id="propertyTokenId" value={tokenId} onChange={e => setTokenId(e.target.value)} />
            </FormGroup>
            <Button color="primary" onClick={addProperty}>Add Property</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;
