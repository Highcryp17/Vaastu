import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table } from 'reactstrap';

const HomePage = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:3001/properties');
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <h1>Welcome to Tokenized Real Estate</h1>
          <p>A platform for fractional property ownership and trading.</p>
          <h2>Total Properties: {properties.length}</h2>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Location</th>
                <th>Price</th>
                <th>Owner</th>
                <th>Token ID</th>
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
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
