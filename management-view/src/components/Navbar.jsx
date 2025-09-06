import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Public Pulse - Management Dashboard</h1>
      <ul>
        <li><a href="#map">Map View</a></li>
        <li><a href="#all-complaints">All Complaints</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;