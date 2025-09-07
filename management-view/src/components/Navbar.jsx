import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <span className="nav-logo">Public Pulse - Management Dashboard</span>
        <ul>
          <li><a href="#map">Map View</a></li>
          <li><a href="#all-complaints">All Complaints</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;