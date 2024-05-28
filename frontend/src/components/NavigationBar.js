import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

const NavigationBar = () => {
  return (
    <Navbar color="light" light expand="md">
      <NavbarBrand href="/">Vaastu</NavbarBrand>
      <Nav className="ml-auto" navbar>
        <NavItem>
          <NavLink tag={Link} to="/">Home</NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/register">Register</NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/dashboard">Dashboard</NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/list-property">List Property</NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/view-properties">View Properties</NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/purchase-property">Purchase Property</NavLink>
        </NavItem>
      </Nav>
    </Navbar>
  );
};

export default NavigationBar;
