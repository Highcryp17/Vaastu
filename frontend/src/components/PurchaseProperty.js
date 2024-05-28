import React, { useState } from 'react';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Web3 from 'web3';
import { purchaseProperty } from '../api';

const PurchaseProperty = () => {
  const [tokenId, setTokenId] = useState('');

  const purchasePropertyHandler = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const purchaseData = { tokenId, buyer: account };
      await purchaseProperty(purchaseData);

      setTokenId('');
    } catch (err) {
      console.error('Error purchasing property:', err.message);
    }
  };

  return (
    <Container>
      <Form>
        <FormGroup>
          <Label for="propertyTokenId">Token ID</Label>
          <Input
            type="text"
            id="propertyTokenId"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
          />
        </FormGroup>
        <Button color="primary" onClick={purchasePropertyHandler}>
          Purchase Property
        </Button>
      </Form>
    </Container>
  );
};

export default PurchaseProperty;
