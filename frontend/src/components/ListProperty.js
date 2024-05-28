import React, { useState } from 'react';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Web3 from 'web3';
import { listProperty } from '../api';

const ListProperty = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');

  const listPropertyHandler = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const propertyData = { name, location, price, owner: account };
      await listProperty(propertyData);

      setName('');
      setLocation('');
      setPrice('');
    } catch (err) {
      console.error('Error listing property:', err.message);
    }
  };

  return (
    <Container>
      <Form>
        <FormGroup>
          <Label for="propertyName">Name</Label>
          <Input
            type="text"
            id="propertyName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="propertyLocation">Location</Label>
          <Input
            type="text"
            id="propertyLocation"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="propertyPrice">Price</Label>
          <Input
            type="number"
            id="propertyPrice"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </FormGroup>
        <Button color="primary" onClick={listPropertyHandler}>
          List Property
        </Button>
      </Form>
    </Container>
  );
};

export default ListProperty;
