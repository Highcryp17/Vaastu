import React, { useState } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const MintToken = () => {
  const [to, setTo] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [error, setError] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const mintToken = async () => {
    try {
      const response = await fetch('http://localhost:3001/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, tokenId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to mint token');
      }

      const result = await response.json();
      setReceipt(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setReceipt(null);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form>
            <FormGroup>
              <Label for="toAddress">To Address</Label>
              <Input
                type="text"
                name="to"
                id="toAddress"
                value={to}
                onChange={e => setTo(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="tokenId">Token ID</Label>
              <Input
                type="text"
                name="tokenId"
                id="tokenId"
                value={tokenId}
                onChange={e => setTokenId(e.target.value)}
              />
            </FormGroup>
            <Button color="primary" onClick={mintToken}>Mint Token</Button>
          </Form>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {receipt && <div>Minting successful: {JSON.stringify(receipt)}</div>}
        </Col>
      </Row>
    </Container>
  );
};

export default MintToken;
