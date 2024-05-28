import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table } from 'reactstrap';
import { getProperties } from '../api';

const ViewProperties = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
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
          <h1>Available Properties</h1>
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

export default ViewProperties;
