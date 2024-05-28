import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditProperty = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/properties/${id}`)
      .then(response => response.json())
      .then(data => {
        setProperty(data);
        setName(data.name);
        setLocation(data.location);
        setPrice(data.price);
      })
      .catch(err => setError(err.message));
  }, [id]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:3001/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, location, price }),
      });

      if (response.ok) {
        console.log('Property updated successfully');
        window.location.href = '/'; // Redirect to home page after updating
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (!property) return <div>Loading...</div>;

  return (
    <Container>
      <Row>
        <Col>
          <Form>
            <FormGroup>
              <Label for="propertyName">Property Name</Label>
              <Input
                type="text"
                name="name"
                id="propertyName"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="propertyLocation">Location</Label>
              <Input
                type="text"
                name="location"
                id="propertyLocation"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="propertyPrice">Price</Label>
              <Input
                type="number"
                name="price"
                id="propertyPrice"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </FormGroup>
            <Button color="primary" onClick={handleUpdate}>Update Property</Button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProperty;
